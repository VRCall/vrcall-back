import { Request, Response } from "express";
import prisma from "../../utils/prisma";

module.exports = async (req: Request, res: Response) => {
  try {
    const { accept } = req.body;
    const id = req.params.id;

    if (accept) {
      await prisma.friendship.update({
        where: {
          id: id,
        },
        data: {
          is_pending: false,
        },
      });
      return res.status(200).json({ message: "Successufully accepted" });
    } else {
      await prisma.friendship.delete({
        where: {
          id: id,
        },
      });

      return res
        .status(200)
        .json({ message: "Successfully refused friendship" });
    }
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(500).json({ message: "An error occured : " + error });
  }
};
