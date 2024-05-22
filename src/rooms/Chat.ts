import { Room, Client } from "@colyseus/core";
import { Chatstate } from "./schema/ChatState";

export class ChatRoom extends Room<Chatstate> {
	maxClients = 4;

	onCreate(options: any) {
		this.setState(new Chatstate());
	}

	onJoin(client: Client, options: any) {
		const { userId } = options;
		console.log(client.sessionId, "joined!");
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId, "left!");
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}
}
/* 
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
}); */
