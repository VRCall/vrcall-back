import { Server, Socket } from 'socket.io';

export const initializeSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_BASE_URL
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Code for chat messages
        socket.on('sendMessage', (data) => {
            console.log("wtdgfzhfjzk");
            
            console.log(data);
            socket.emit("receiveMessage", data)
            //createMessage(socket, messageContent);
        });

        // socket.on('editMessage', (editedMessage: { messageId: string, newContent: string }) => {
        //     editMessage(editedMessage);
        // });

        // Code for calls

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