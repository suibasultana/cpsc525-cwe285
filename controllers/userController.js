const db = require("../data/db");

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = db.users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user in session
    req.session.userId = user.id;

    res.json({ message: "Logged in", userId: user.id });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
};
