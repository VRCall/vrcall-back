const { Router } = require("express");
const router = Router();
import authentication from "../../utils/auth";

const createMessage = require("./CREATE_Message");
const getMessages = require("./GET_Messages");
// const editMessage= require("./EDIT_Message")

router.get("/messages/:id", authentication, getMessages);
router.post("/", authentication, createMessage);
// router.put('/:id',authentication,editMessage)

module.exports.routes = router;
