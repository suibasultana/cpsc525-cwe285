const express = require("express");
const router = express.Router();
const messages = require("../controllers/messageController");

// Vulnerable route since no authorization middleware
router.get("/:id", messages.viewMessage);

router.post("/", messages.sendMessage);

// Vulnerable route to handle the different actions passed to the server
router.post("/action", messages.handleAction);

module.exports = router;
