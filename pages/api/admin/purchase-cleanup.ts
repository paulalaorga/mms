import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb.mjs';
import User from '../../../models/User.mjs';
import PurchasedProgram from '../../../models/Purchase.mjs';
import { Types } from 'mongoose';

// Define interfaces for our data structures
interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface Purchase {
  purchaseId: Types.ObjectId | null;
  purchaseType: string;
}

interface UserDocument {
  _id: Types.ObjectId;
  email: string;
  purchases: Purchase[];
}

interface PurchaseDocument {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();
  
  const session = await getServerSession(req, res, authOptions);
  
  // Use the defined interface for better type safety
  if (!session || !session.user || (session.user as UserSession).role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }
  
  try {
    await dbConnect();

    // Find users with problematic purchase records
    const usersWithInvalidPurchases = await User.find({
      'purchases.purchaseId': null
    }) as UserDocument[];

    console.log(`Found ${usersWithInvalidPurchases.length} users with invalid purchases`);

    for (const user of usersWithInvalidPurchases) {
      // Filter out null or invalid purchases
      const validPurchases = user.purchases.filter(
        purchase => purchase.purchaseId !== null && 
                    purchase.purchaseType === 'PurchasedProgram'
      );

      // Update user with cleaned purchases
      await User.findByIdAndUpdate(user._id, {
        $set: { purchases: validPurchases }
      });

      console.log(`Cleaned purchases for user: ${user.email}`);
    }

    // Remove orphaned purchase records
    const orphanedPurchases = await PurchasedProgram.find({
      userId: { $exists: false }
    }) as PurchaseDocument[];

    console.log(`Found ${orphanedPurchases.length} orphaned purchase records`);

    if (orphanedPurchases.length > 0) {
      // Use proper typing with the interface
      await PurchasedProgram.deleteMany({
        _id: { $in: orphanedPurchases.map((p: PurchaseDocument) => p._id) }
      });
    }

    // Validate and repair purchase references
    const users = await User.find({}).populate('purchases.purchaseId') as UserDocument[];
    
    for (const user of users) {
      const validPurchases: Purchase[] = []; // Properly typed array
      
      for (const purchase of user.purchases) {
        if (purchase.purchaseId && purchase.purchaseType === 'PurchasedProgram') {
          const existingPurchase = await PurchasedProgram.findById(purchase.purchaseId);
          
          if (existingPurchase) {
            validPurchases.push(purchase);
          } else {
            console.log(`Removing invalid purchase reference for user ${user.email}`);
          }
        }
      }

      // Update user's purchases if any changes were made
      if (validPurchases.length !== user.purchases.length) {
        await User.findByIdAndUpdate(user._id, {
          $set: { purchases: validPurchases }
        });
      }
    }

    return res.status(200).json({ 
      message: 'Purchase data cleanup completed successfully',
      usersWithInvalidPurchases: usersWithInvalidPurchases.length,
      orphanedPurchases: orphanedPurchases.length
    });

  } catch (error) {
    console.error('Error during purchase data cleanup:', error);
    return res.status(500).json({ 
      error: 'Failed to cleanup purchase data',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}