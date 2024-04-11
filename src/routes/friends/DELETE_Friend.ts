import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
	try {
		const friendshipId = req.params.id;

		if (!friendshipId) {
			res.status(404).json({ message: "Please give a friendship id" });
		}

		await prisma.friendshipMessage.deleteMany({
			where: {
				friendship_id: friendshipId
			}
		});

		await prisma.friendship.deleteMany({
			where: {
				id: friendshipId
			}
		});

		return res.status(200).json({ message: "Friend deleted" });
	} catch (error: any) {
		console.log("Error : " + error);
		return res.status(500).json({ message: "An error occured : " + error });
	}
};
