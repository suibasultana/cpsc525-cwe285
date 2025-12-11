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
