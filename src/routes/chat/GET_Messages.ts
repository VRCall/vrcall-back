import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

module.exports = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const messages = await prisma.friendshipMessage.findMany({
			where: {
				friendship_id: id
			},
			select: {
				friendship_id: true,
				text: true,
				sent_at: true,
				sender: {
					select: {
						pseudo: true
					}
				}
			},
			orderBy: {
				sent_at: "asc"
			}
		});

		let messagesToReturn: {
			friendship_id: string;
			text: string;
			senderName: string;
			sent_at: Date;
		}[] = [];

		messages.map((message) => {
			messagesToReturn.push({
				friendship_id: message.friendship_id,
				text: message.text,
				senderName: message.sender.pseudo,
				sent_at: message.sent_at
			});
		});

		return res.status(200).json({ messages: messagesToReturn });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return res.status(500).json({ test: error });
	}
};
