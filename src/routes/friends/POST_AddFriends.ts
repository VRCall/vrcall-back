import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { send } from "process";

module.exports = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const { pseudo, user } = req.body;

    /*  
    
    toi = user => we have everything about you fucker
    
    
    */

    if (!pseudo) {
      return res.status(400).json({ message: "Empty area" });
    }

    if (user.pseudo === pseudo) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        pseudo: pseudo,
      },
    });
    // we also have everything about your friend fucker

    if (!receiver) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const checkFriendshipExistance = await prisma.friendship.findFirst({
      where: {
        OR: [
          { sender_id: user.id, receiver_id: receiver.id },
          { sender_id: receiver.id, receiver_id: user.id },
        ],
      },
    });

    if (checkFriendshipExistance) {
      return res
        .status(200)
        .json({ message: "Please accept your friend's request" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        sender_id: user.id,
        receiver_id: receiver.id,
      },
    });

    if (!friendship) return res.status(400).json({ message: "failure" });

    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(500).json({ message: "An error occured : " + error });
  }
};
