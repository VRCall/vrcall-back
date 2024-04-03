import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

module.exports = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const friendshipId = req.params.friendshipId;
    if (!friendshipId) {
      return res.status(400).json({ message: "Not logged in" });
    }

    const profile = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!profile) {
      return res.status(400).json({ message: "User not found" });
    }

    let foundUser;

    if (profile && profile.sender.pseudo === user.pseudo) {
      const { pseudo, img, is_validated, email, created_at, modified_at } =
        profile.receiver;
      foundUser = { pseudo, img, is_validated, email, created_at, modified_at };
    } else {
      foundUser = profile.sender;
    }

    return res.status(200).json(foundUser);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occured:" + e });
  }
};
