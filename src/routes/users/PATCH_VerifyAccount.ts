import { Request, Response } from "express";
import prisma from "../../utils/prisma";

module.exports = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		const user = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (!user) {
			return res.status(404).json(false);
		}

		await prisma.user.update({
			where: {
				id: id
			},
			data: {
				is_validated: true
			}
		});

		return res.status(200).json(true);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An error occured : " + error });
	}
};
