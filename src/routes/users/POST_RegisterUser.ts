import { Request, Response } from "express";
import prisma from "../../utils/prisma";
const bcrypt = require("bcrypt");
import z from "zod";
import { sendMailVerification } from "../../utils/mail";
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const RegisterSchema = z
	.object({
		pseudo: z.string().regex(/^[A-Za-z0-9_.]+$/),
		email: z.string().email(),
		password: z.string().min(6),
		confirmPassword: z.string().min(6)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "The passwords are not identical"
	});

module.exports = async (req: Request, res: Response) => {
	try {
		const { pseudo, email, password, confirmPassword } = req.body;
		//@ts-ignore
		const image = req.file;

		console.log(image);

		// if (!image?.mimetype.startsWith("image/")) {
		// 	fs.unlink(`./uploads/${image?.filename}`)
		// 	return res.status(400).json({ message: "Invalid image" });
		// }

		const validatedFields = RegisterSchema.safeParse({
			pseudo: pseudo,
			email: email,
			password: password,
			confirmPassword: confirmPassword
		});

		if (!validatedFields.success) {
			return res.status(400).json({ message: validatedFields.error });
		}

		const userExists = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: validatedFields.data.email },
					{ pseudo: validatedFields.data.pseudo }
				]
			}
		});

		if (userExists !== null) {
			return res.status(400).json({ message: "Email already used" });
		}

		const hashedPassword = await bcrypt.hash(
			validatedFields.data.password,
			parseInt(process.env.SALTS!)
		);

		//const profileImg = "/images" + image.filename;

		const newUser = await prisma.user.create({
			data: {
				pseudo: validatedFields.data.pseudo,
				email: validatedFields.data.email,
				password: hashedPassword,
				img: /*profileImg*/ "/images/default.png"
			}
		});

		const mail = await sendMailVerification({
			to: validatedFields.data.email,
			subject: `Verify VRCall account ${newUser.pseudo} !`,
			html: `
		<h1>
			Welcome to VRCall !
		</h1>
		<p>
			Please verify your account by clicking on the link below : <a href="${process.env.FRONTEND_BASE_URL}/verify/${newUser.id}" target="_blank">Verify account</a>
		</p>
		`
		});
		if (mail.accepted.includes(validatedFields.data.email)) {
			console.log("Mail sent");
		} else {
			return res
				.status(400)
				.json({ message: "Please add a valid email" });
		}

		return res
			.status(201)
			.json({ message: "Check your email for account verification" });
	} catch (error: any) {
		console.log("Error : " + error);
		return res.status(500).json({ message: "An error occured : " + error });
	}
};
