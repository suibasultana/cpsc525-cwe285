const express = require("express");
const router = express.Router();

const users = require("../controllers/userController.js");

// LOGIN
router.post("/login", users.login);

// LOGOUT
router.post("/logout", users.logout);

module.exports = router;
