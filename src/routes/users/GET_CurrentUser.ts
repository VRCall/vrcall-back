import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
  try {
    const id = req.body.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ test: error });
  }
};
