import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import cors from "cors";


const express = require("express");
const fs = require("fs");

const usersRouter = require("./routes/users/router");
const messagesRouter = require("./routes/chat/router");
const friendshipsRouter = require("./routes/friends/router");
const notificationRouter = require("./routes/notification/router");

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { Request, Response } from "express";
import path from "path";

export default config({
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom);
  },

  initializeExpress: (app) => {
    const corsOptions = {
      origin: "*",
    };

    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/uploads", express.static("images"));
    app.use(cors(corsOptions));


    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    app.use("/users", usersRouter.routes);
    app.use("/chat", messagesRouter.routes);

    app.get("/images/:imageName", (req: Request, res: Response) => {
      const imageName = path.basename(req.params.imageName);
      const readStream = fs.createReadStream(`uploads/${imageName}`);
      readStream.pipe(res);
    });
    app.set("trust proxy", 1);

    app.use("/friendships", friendshipsRouter.routes);
    app.use("/notification", notificationRouter.routes);

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
