const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: "secret-key-123",
    resave: false,
    saveUninitialized: true
}));

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
