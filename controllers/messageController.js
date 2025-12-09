const db = require("../data/db");

// no authorization checks( This is the cwe 285 improper authorization  )
exports.viewMessage = (req, res) => {
    const messageId = parseInt(req.params.id);

    const msg = db.messages.find(m => m.id === messageId);

    if (!msg) {
        return res.status(404).json({ error: "Message not found" });
    }

    // not checking 
    // if (msg.receiverId !== req.session.userId) { ... }

    res.json({
        message: "VULNERABLE ENDPOINT",
        details: msg
    });
};

// User can send messages safely  but still no ownership checks)
exports.sendMessage = (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.session.userId;

    const newMessage = {
        id: db.messages.length + 1,
        senderId,
        receiverId,
        content
    };

    db.messages.push(newMessage);

    res.json({ message: "Message sent!", data: newMessage });
};
