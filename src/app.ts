import express, { Application } from 'express';
import cors from 'cors';
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
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
