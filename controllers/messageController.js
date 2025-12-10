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

// Define a function to call the corresponding 'action' function based on the action
exports.handleAction = (req, res) => {
    
    const { action, id, content } = req.body;

    switch(action) {
        case "edit":
            return editMessage(id, content, res);
        case "delete":
            // Logic for handling unauthorised deletion of a message
        case "flag":
            // Logic for handling unauthorised flaggin of a message
        case "forward":
            // Logic for handling unauthorised forwadding of a message
        case "default":
            res.status(404).json({ error : "Specified action not found"});
    };
};

function editMessage(id, content, res) {
    
    // Find the message object to be edited
    const message = db.messages.find(message => message.id == id);

    // Update the message content to the given content
    message.content = content;

    // Save updated message object
    const updatedMessage = message;

    // Return response showing message was edited
    res.json({
        message : "Successfully altered message.",
        data : updatedMessage
    });
}