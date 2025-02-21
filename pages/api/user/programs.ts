import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Program from "@/models/Program";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const programs = await Program.find({});
      res.status(200).json(programs);
    } catch {
      res.status(500).json({ error: "Error al obtener los programas" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
