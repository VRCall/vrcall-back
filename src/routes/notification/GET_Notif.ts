import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
	try {
		const userId = req.body.user.id;

		const notifications = await prisma.notification.findMany({
			where: {
				user_id: userId
			}
		});

		res.status(200).json({ notifications: notifications });
	} catch (error) {
		console.error("Error getting notifications:", error);
		res.status(500).json({ error: "Error getting notifications" });
	}
};
