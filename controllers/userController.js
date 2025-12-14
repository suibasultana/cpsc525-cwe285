//Handles authentication-related actions for the application.
//This controller intentionally demonstrates weak authorization logic
//to support CWE-285 (Improper Authorization) analysis in the project.


const db = require("../data/db");

// Authenticates a user by matching username and password
// against the in-memory database.
exports.login = (req, res) => {
    console.log("LOGIN BODY:", req.body);
    console.log("DB USERS:", db.users);

    //extract and normalize input
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    const user = db.users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        console.log("LOGIN FAILED: invalid credentials");
        return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;

    console.log("LOGIN SUCCESS:", user);
    res.json({ message: "Logged in", userId: user.id });
};

// destroys the current session.
// does not verify user role or permissions.
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
};
