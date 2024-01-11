const express = require("express");
const { getMessage, sendMessage, unreadNumMessage,getAll } = require("../controllers/message.js");
const router = express.Router();

router.route("/getmessage").post(getMessage);
router.route("/all").get(getAll);
router.route("/unread/:id").get(unreadNumMessage);
router.route("/").post(sendMessage);

module.exports = router;