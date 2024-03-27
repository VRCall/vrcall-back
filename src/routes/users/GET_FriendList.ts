import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { Request, Response } from "express";

module.exports = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    if (!user) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let friendList = await prisma.user.findMany({
      where: {
        id: user.id,
      },
      select: {
        sent_friendships: {
          select: {
            receiver: {
              select: {
                id: true,
                pseudo: true,
                img: true,
              },
            },
          },
        },
        received_friendships: {
          select: {
            sender: {
              select: {
                id: true,
                pseudo: true,
                img: true,
              },
            },
          },
        },
      },
    });

    friendList = friendList[0].sent_friendships.map(
      (friend: any) => friend.receiver
    );

    if (friendList.length === 0) {
      return res.status(400).json({ message: "No friends" });
    }

    return res.status(200).json(friendList);
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(400).json({ message: "An error occured : " + error });
  }
};
