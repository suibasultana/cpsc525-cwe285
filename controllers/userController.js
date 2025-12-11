console.log("LOGIN ROUTE HIT!");

const db = require("../data/db");

exports.login = (req, res) => {
    console.log("LOGIN BODY:", req.body);
    console.log("DB USERS:", db.users);

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

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
};
