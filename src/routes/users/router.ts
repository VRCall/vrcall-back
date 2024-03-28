const { Router } = require("express");
const router = Router();
import { Request, Response } from "express";
import authentication from "../../utils/auth";

// Get methods
const registerUser = require("./POST_RegisterUser");
const loginUser = require("./POST_LoginUser");
const getFriendList = require("./GET_FriendList");
const getUser = require("./GET_User")

// Add to router
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/friends", authentication, getFriendList);
router.get("/current", authentication, getUser);
router.post("/auth", authentication, (req: Request, res: Response) => {
    res.json(true);
})

module.exports.routes = router;