const path = require("path");
const express = require("express");

const router = express.Router();
const loginController = require("../controllers/login");
const chatController = require("../controllers/chat");

router.get("/", loginController.getLoginPage);
router.get("/chat", chatController.getChatPage);

module.exports = router;
