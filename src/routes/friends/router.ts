const { Router } = require("express");
const router = Router();
import authentication from "../../utils/auth";

// Get methods
const addFriends = require("./POST_AddFriends");
const receivedFriends = require("./GET_AddFriends");


// Add to router
router.post("/", authentication, addFriends);
router.get("/", authentication, receivedFriends);

module.exports.routes = router;