import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { Request, Response } from "express";

module.exports = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    if (!user) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const friendships = await prisma.user.findMany({
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
    const sentFriendships = friendships[0].sent_friendships.map(
      (friendship) => {
        return {
          id: friendship.receiver.id,
          pseudo: friendship.receiver.pseudo,
          img: friendship.receiver.img,
        };
      }
    );
    const receivedFriendships = friendships[0].received_friendships.map(
      (friendship) => {
        return {
          id: friendship.sender.id,
          pseudo: friendship.sender.pseudo,
          img: friendship.sender.img,
        };
      }
    );
    const merged = [...sentFriendships, ...receivedFriendships];
    const filteredList = new Map(merged.map((item) => [item["id"], item]));
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
