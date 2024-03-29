import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

module.exports = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    if (!user) {
      return res.status(400).json({ message: "Not logged in" });
    }

    const profile = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        pseudo: true,
        img: true,
        is_validated: true,
        email: true,
        created_at: true,
        modified_at: true,
      },
    });

    if(!profile) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(profile);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occured:" + e});
  }
};
