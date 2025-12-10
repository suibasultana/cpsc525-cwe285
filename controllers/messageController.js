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

    // Find the message object corresponding to the provided id
    const message = db.messages.find(message => message.id == parseInt(id));

    // Return ERROR 404: NOT FOUND if message object cannot be found
    if(!message) {
        res.status(404).json({
            error : `Couldn't find message with messageID ${id}.`
        })
    }

    // Handle different use cases once message object is found
    switch(action) {
        case "edit":
            return editMessage(message, content, res);
        case "delete":
            return deleteMessage(id, res);
        case "flag":
            // Logic for handling unauthorised flaggin of a message
        case "forward":
            // Logic for handling unauthorised forwadding of a message
        case "default":
            res.status(404).json({ error : "Specified action not found"});
    };
};

// Handles Edit action
function editMessage(message, content, res) {
    
    // Update the message content to the given content
    message.content = content;

    // Save updated message object
    const editedMessage = message;

    // Return response showing message was edited
    res.json({
        message : "VULNERABLE ACTION: UNAUTHORISED EDITING",
        data : editedMessage
    });
}

// Handles Delete action
function deleteMessage(id, res) {
    
    // Delete message object from messages array with corresponding id
    const editedMessages = db.messages.filter(m => m.id !== parseInt(id));

    // Return response showing message was deleted
    res.json({
        message : "VULNERABLE ACTION: UNAUTHORISED DELETION",
        data : editedMessages
    })
}