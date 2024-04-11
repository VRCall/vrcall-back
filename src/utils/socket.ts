import { Server, Socket } from "socket.io";

export const initializeSocketIO = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
			credentials: true
		},
		allowEIO3: true
	});

	io.on("connection", (socket: Socket) => {
		// Code for chat messages
		socket.on("join-chat", (chatId: string, userId: string) => {
			socket.join(chatId);
			socket.to(chatId).emit("user-connected", userId);
		});

		socket.on("leave-chat", (chatId: string) => {
			socket.leave(chatId);
		});

		socket.on("sendMessage", (data) => {
			socket.to(data.chatId).emit("receiveMessage", data);

			const NotificationData = {
				type: "message",
				text: "New message from " + data.senderName,
				chatId: data.chatId
			};

			socket
				.to(data.receiverName)
				.emit("send-notification", NotificationData);
		});

		// Code for calls

		socket.emit("me", socket.id);

		socket.on("join-room", (roomId: string, userId: string) => {
			socket.join(roomId);
			socket.to(roomId).emit("user-connected", userId);
		});

		socket.on("ready", (roomId: string, userId: string) => {
			socket.to(roomId).emit("user-ready", userId);
		});

		socket.on("position", (data) => {
			socket.broadcast.emit("remote-position", data);
		});

		// notification
		socket.on("join-notification", (pseudo: string) => {
			socket.join(pseudo);
			console.log("Notification joined", pseudo);
		});

		// send friend request
		socket.on("send-friend-request", (data) => {
			console.log("Friend request sent");
			console.log(data);
			socket.to(data.receiver).emit("send-notification", data);
		});

		// send call notification
		socket.on("send-call-notification", (data) => {
			socket.to(data.receiverName).emit("send-notification", data);
		});
	});
};
