const { Router } = require("express");
const router = Router();
import authentication from "../../utils/auth";

// Get methods
const addFriends = require("./POST_AddFriends");
const friendRequests = require("./GET_FriendRequests");
const acceptFriends = require("./PATCH_AcceptFriends");
const getCheckFriendship = require("./GET_CheckFriendship")

// Add to router
router.post("/", authentication, addFriends);
router.get("/friend-requests", authentication, friendRequests);
router.patch("/accept-friends/:id", authentication, acceptFriends);
router.get('/checkfriendship/:id', authentication,getCheckFriendship)

module.exports.routes = router;
