import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
	try {
		const { userId, type, text, user } = req.body;

		const newNotification = await prisma.notification.create({
			data: {
				user_id: userId,
				type: type,
				text: text,
				sender_id: user.id
			}
		});
		res.status(201).json({ notification: newNotification });
	} catch (error) {
		console.error("Error creating notification:", error);
		res.status(500).json({ error: "Error creating notification" });
	}
};
