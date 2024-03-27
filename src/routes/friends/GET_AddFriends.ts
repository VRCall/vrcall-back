import { Request, Response } from "express";
import prisma from "../../utils/prisma";

module.exports = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { user } = req.body;
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(500).json({ message: "An error occured : " + error });
  }
};
