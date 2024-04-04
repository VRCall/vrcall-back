import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
	try {
		const friendshipId = req.params.id;
		const { user } = req.body;

		const friendship = await prisma.friendship.findUnique({
			where: {
				id: friendshipId
			},
			include: {
				sender: true,
				receiver: true
			}
		});

		if (
			user.id === friendship?.sender_id ||
			user.id === friendship?.receiver_id
		) {
			return res.status(200).json({ isFriend: true });
		} else {
			return res.status(401).json({ isFriend: false });
		}
	} catch (error) {
		console.error("Error checking friendship:", error);
		return res
			.status(403)
			.json({
				message: "You are not friends. You cannot access this chat."
			});
	}
};
