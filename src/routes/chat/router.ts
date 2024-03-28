const { Router } = require("express");
const router = Router();
import { Server, Socket } from 'socket.io';
import authentication from "../../utils/auth";

const createMessage = require("./CREATE_Message");
const getMessages = require("./GET_Messages");
// const editMessage= require("./EDIT_Message")

 

export const initializeSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_BASE_URL
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on('sendMessage', (messageContent: string) => {
            console.log(messageContent);
            socket.emit("receiveMessage", messageContent)
            //createMessage(socket, messageContent);
        });

        // socket.on('editMessage', (editedMessage: { messageId: string, newContent: string }) => {
        //     editMessage(editedMessage);
        // });
    });
};

router.get('/messages/:id',authentication, getMessages)
router.post('/',authentication, createMessage)
// router.put('/:id',authentication,editMessage)


module.exports.routes = router;