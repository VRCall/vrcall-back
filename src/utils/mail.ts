const nodemailer = require("nodemailer");
require("dotenv").config();

export const sendMailVerification = async ({
	to,
	subject,
	html
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	try {
		const transporter = nodemailer.createTransport({
			port: process.env.MAIL_PORT,
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_ADDRESS,
				pass: process.env.MAIL_PASSWORD
			},
			secure: false
		});

		const mailOptions = {
			from: process.env.MAIL_ADDRESS,
			to: to,
			subject: subject,
			html: html
		};

		const info = await transporter.sendMail(mailOptions);
		console.log(info);

		return info;
	} catch (error) {
		console.error(error);
	}
};
