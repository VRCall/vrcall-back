const { Router } = require("express");
import authentication from "../../utils/auth";

const router = Router();

// Get methods
const createNotification = require("./CREATE_Notif");
const getNotifications = require("./GET_Notif");

// Add to router
router.post('/', authentication, createNotification);
router.get('/', authentication, getNotifications);

module.exports.routes = router;
