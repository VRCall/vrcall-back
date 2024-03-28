import express, { Application } from 'express';
import cors from 'cors';
import { Socket } from 'socket.io';
const { ExpressPeerServer } = require("peer");
import { createServer } from 'http';
import { initializeSocketIO } from './routes/chat/router'; 

const app: Application = express();

const usersRouter = require("./routes/users/router");
const messagesRouter = require("./routes/chat/router");


const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL || '*' 
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/users", usersRouter.routes);
app.use("/chat", messagesRouter.routes); 


const server = createServer(app);

initializeSocketIO(server);


const port = process.env.PORT || 8000;

app.use("/users", usersRouter.routes)

const http = require("http").Server(app);
const io: Socket = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket: Socket) => {
    console.log(`⚡️ ${socket.id} just connected`);

    socket.emit("me", socket.id)

    socket.on("join-room", (roomId: string, userId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId)
        console.log(roomId);
    })

    socket.on("call", (data) => {
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name})

    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted"), data.signal
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })
});

http.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// const peerServer = ExpressPeerServer(server, {
//     path: "/myapp"
// });

// app.use("/peerjs", peerServer);