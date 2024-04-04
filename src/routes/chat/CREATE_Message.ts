import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Server, Socket } from "socket.io";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
  try {
    const { text, friendship_id, user } = req.body;

    const newMessage = await prisma.friendshipMessage.create({
      data: {
        text: text,
        friendship_id: friendship_id,
        sender_id: user.id,
      },
    });

    return res.status(201).json({ test1: newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ test: error });
  }
};
