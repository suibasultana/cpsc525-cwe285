const express = require("express");
const router = express.Router();
const messages = require("../controllers/messageController");



/**
 * SECURE ROUTES
 * These use proper checks and are used to demonstrate the fixed version.
 * Putting them BEFORE the vulnerable /:id route so /secure/... will still work.
 */

// Secure version: View a single message with Auth + Ownership check.
router.get("/secure/:id", messages.viewMessageSecure);

// Secure version: Handle actions (edit/delete/flag/forward/inbox) securely.
router.post("/secure/action", messages.handleActionSecure);




/**
 * VULNERABLE ROUTES (original ones)
 * These remain unchanged so we can still demonstrate CWE-285.
 */

// Vulnerable route since no authorization middleware
router.get("/:id", messages.viewMessage);

router.post("/", messages.sendMessage);

// Vulnerable route to handle the different actions passed to the server
router.post("/action", messages.handleAction);

module.exports = router;
