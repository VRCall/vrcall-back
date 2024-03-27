import { Friendship } from "./../../../node_modules/.prisma/client/index.d";
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
        sent_friendships: {
          where: {
            is_pending: false,
          },
          select: {
            id: true,
            receiver: {
              select: {
                pseudo: true,
                img: true,
              },
            },
          },
        },
        received_friendships: {
          where: {
            is_pending: false,
          },
          select: {
            id: true,
            sender: {
              select: {
                pseudo: true,
                img: true,
              },
            },
          },
        },
      },
    });
    const sentFriendships = friendships!.sent_friendships.map((friendship) => {
      return {
        pseudo: friendship.receiver.pseudo,
        img: friendship.receiver.img,
        friendship_id: friendship.id,
      };
    });
    const receivedFriendships = friendships!.received_friendships.map(
      (friendship) => {
        return {
          pseudo: friendship.sender.pseudo,
          img: friendship.sender.img,
          friendship_id: friendship.id,
        };
      }
    );
    const merged = [...sentFriendships, ...receivedFriendships];
    const filteredList = new Map(merged.map((item) => [item["pseudo"], item]));
    const friendList = Array.from(filteredList.values()).sort((a, b) =>
      a.pseudo.localeCompare(b.pseudo)
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
