import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  if (req.method === "GET") {
    await connectDB();
    const { token } = req.query;

    const user = await User.findOne({ confirmationToken: token });

    if (!user) return res.status(400).json({ message: "Token inválido o expirado" });

    user.isConfirmed = true;
    user.confirmationToken = null;
    await user.save();

    return res.status(200).json({ message: "Cuenta confirmada" });
  }
  res.status(405).end();
}
