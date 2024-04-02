import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { Request, Response } from "express";

module.exports = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    if (!user) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const friendships = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        received_friendships: {
          where: {
            is_pending: true,
          },
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                pseudo: true,
                img: true,
              },
            },
            sent_at: true,
          },
        },
      },
    });

    if (!friendships) {
      return;
    }

    const receivedFriendships = friendships!.received_friendships.map(
      (friendship) => {
        return {
          friendship_id: friendship.id,
          id: friendship.sender.id,
          pseudo: friendship.sender.pseudo,
          img: friendship.sender.img,
          sent_at: friendship.sent_at,
        };
      }
    );
    const filteredList = new Map(
      receivedFriendships.map((item) => [item["id"], item])
    );
    const friendList = Array.from(filteredList.values());

    return res.status(200).json(friendList);
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(400).json({ message: "An error occured : " + error });
  }
};
