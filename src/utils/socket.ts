import { Server, Socket } from 'socket.io';

export const initializeSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    console.log("Hello socket");

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on("join-chat", (chatId: string, userId: string) => {
            socket.join(chatId);
            socket.to(chatId).emit("user-connected", userId)
        })

        socket.on('sendMessage', async (data) => {
            console.log("Message sent");
            
            console.log(data);
            socket.to(data.chatId).emit("receiveMessage", data)

            const notificationData = {
                chatId: data.chatId,
                senderId: data.senderId, 
            };
            socket.to(data.chatId).emit("sendNotification", notificationData);
        });

        socket.emit("me", socket.id)

        socket.on("join-room", (roomId: string, userId: string) => {
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", userId)
        })

        socket.on("ready", (roomId: string, userId: string) => {
            socket.to(roomId).emit("user-ready", userId)
        })

        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded")
        })
    });
};
