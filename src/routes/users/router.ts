const { Router } = require("express");
const router = Router();
import { Request, Response } from "express";
import authentication from "../../utils/auth";
const multer = require("multer")
import { FileFilterCallback } from "multer"
const fs = require("fs")

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const upload = multer({
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback) => {
        
        let path = `./uploads`
       
        callback(null, path);
      },
      filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback) => {
        let fileExtension = file.originalname.split(".").pop();
        let newFileName = "/" + crypto.randomUUID() + "." + fileExtension;
        callback(null, newFileName);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Get methods
const registerUser = require("./POST_RegisterUser");
const loginUser = require("./POST_LoginUser");
const getFriendList = require("./GET_FriendList");

// Add to router
router.post("/signup", upload.single('profilePicture'), registerUser);
router.post("/login", loginUser);
router.get("/friends", authentication, getFriendList);
router.post("/auth", authentication, (req: Request, res: Response) => {
    res.json(true);
})

module.exports.routes = router;