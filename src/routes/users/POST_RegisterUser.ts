import { Request, Response } from "express";
import prisma from "../../utils/prisma";
const bcrypt = require("bcrypt");
import z from "zod";
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const RegisterSchema = z
  .object({
    pseudo: z.string().regex(/^[A-Za-z0-9_.]+$/),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords are not identical",
  });

module.exports = async (req: Request, res: Response) => {
  try {
    const { pseudo, email, password, confirmPassword } = req.body;
    //@ts-ignore
    const image = req.file;

    if (image !== null && !image?.mimetype.startsWith("image/")) {
      //fs.unlink(`./uploads/${image?.filename}`)
      return res.status(400).json({ message: "Invalid image" });
    }

    const validatedFields = RegisterSchema.safeParse({
      pseudo: pseudo,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    if (!validatedFields.success) {
      return res.status(400).json({ message: validatedFields.error });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedFields.data.email },
          { pseudo: validatedFields.data.pseudo },
        ],
      },
    });

    if (userExists !== null) {
      return res.status(400).json({ message: "Already in use" });
    }

    const hashedPassword = await bcrypt.hash(
      validatedFields.data.password,
      parseInt(process.env.SALTS!),
    );

    const profileImg = "/images" + image.filename;

    await prisma.user.create({
      data: {
        pseudo: validatedFields.data.pseudo,
        email: validatedFields.data.email,
        password: hashedPassword,
        img: profileImg,
      },
    });

    return res.status(201);
  } catch (error: any) {
    console.log("Error : " + error);
    return res.status(500).json({ message: "An error occured : " + error });
  }
};
