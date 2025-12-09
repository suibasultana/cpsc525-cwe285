const express = require("express");
const router = express.Router();
const messages = require("../controllers/messageController");

// Vulnerable route since no authorization middleware
router.get("/:id", messages.viewMessage);

router.post("/", messages.sendMessage);

module.exports = router;
