import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocketIO } from './routes/chat/router'; 
const fs = require("fs")

const app: Application = express();

const usersRouter = require("./routes/users/router");
const messagesRouter = require("./routes/chat/router");


const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL || '*' 
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("images"))
app.use(cors(corsOptions));

app.use("/users", usersRouter.routes);
app.use("/chat", messagesRouter.routes); 

app.get('/images/:imageName', (req: Request, res: Response) => {
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`uploads/${imageName}`)
    readStream.pipe(res)
})


const server = createServer(app);

initializeSocketIO(server);


const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});