import connectDB from "../lib/mongodb.mts";
import User from "../models/User.mts"; // Asegúrate de que el archivo existe
import PurchasedProgram from "../models/Purchase.mts";
import "dotenv/config";

class UserPurchaseCleanup {
  /**
   * Remove invalid or duplicate purchases from user records
   */
  static async cleanupUserPurchases() {
    await connectDB();
    
    console.log("User model:", User); // ✅ Ahora dentro del método

    try {
      // Find users with problematic purchase records
      const usersWithInvalidPurchases = await User.find({
        "purchases.purchaseId": null,
      });

      console.log(
        `Found ${usersWithInvalidPurchases.length} users with invalid purchases`
      );

      for (const user of usersWithInvalidPurchases) {
        // Filter out null or invalid purchases
        const validPurchases = user.purchases.filter(
          (purchase) =>
            purchase.purchaseId !== null &&
            purchase.purchaseType === "PurchasedProgram"
        );

        // Update user with cleaned purchases
        await User.findByIdAndUpdate(user._id, {
          $set: { purchases: validPurchases },
        });

        console.log(`Cleaned purchases for user: ${user.email}`);
      }

      // Remove orphaned purchase records
      const orphanedPurchases = await PurchasedProgram.find({
        userId: { $exists: false },
      });

      console.log(`Found ${orphanedPurchases.length} orphaned purchase records`);

      if (orphanedPurchases.length > 0) {
        await PurchasedProgram.deleteMany({
          _id: { $in: orphanedPurchases.map((p) => p._id) },
        });
      }

      console.log("Purchase cleanup completed successfully");
    } catch (error) {
      console.error("Error during purchase cleanup:", error);
      throw error;
    }
  }

  /**
   * Run full purchase data integrity check and cleanup
   */
  static async runFullPurchaseIntegrityCheck() {
    console.log("Starting full purchase data integrity check");

    try {
      await this.cleanupUserPurchases();

      console.log("Full purchase integrity check completed successfully");
    } catch (error) {
      console.error("Error during full purchase integrity check:", error);
      throw error;
    }
  }
}

// Entry point for command-line execution
async function main() {
  try {
    console.log("Starting Purchase Data Integrity Cleanup");

    await UserPurchaseCleanup.runFullPurchaseIntegrityCheck();

    console.log("Purchase Data Cleanup Completed Successfully");
    process.exit(0);
  } catch (error) {
    console.error("Purchase Data Cleanup Failed:", error);
    process.exit(1);
  }
}

// Only run if directly executed (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default UserPurchaseCleanup;
