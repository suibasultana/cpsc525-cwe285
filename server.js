
// entry point for the ChatWithMe backend server.
// this file sets up the Express application, session handling,
// CORS configuration, and API routes used by the frontend.
// the backend intentionally contains weak authorization checks
// to demonstrate CWE-285 (Improper Authorization).
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: "secret-key-123",
    resave: false,
    saveUninitialized: true
}));

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.listen(4000, () => {
    console.log("SERVER RUNNING at http://localhost:4000");
});