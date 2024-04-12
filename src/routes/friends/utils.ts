import { User } from "@prisma/client";
import prisma from "../../utils/prisma";

export const checkFriendshipExistance = async (user: User, receiver: User) => {
	const data = await prisma.friendship.findFirst({
		where: {
			OR: [
				{ sender_id: user.id, receiver_id: receiver.id },
				{ sender_id: receiver.id, receiver_id: user.id }
			]
		}
	});
	if (data) return true;
};
