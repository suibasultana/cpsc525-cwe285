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
        content,
        flag: "none"
    };

    db.messages.push(newMessage);

    res.json({ message: "Message sent!", data: newMessage });
};

// Define a function to call the corresponding 'action' function based on the action
exports.handleAction = (req, res) => {

    // Initialise message object 
    let message = null;

    // Get the currently logged in userId
    const loggedInId = req.session.userId;

    // Extract values of parameters from the request's body
    const { action, id, content, flag, targetSenderId } = req.body;

    // Retrieve message object if messageId is provided in the request body
    if (id) {
        // Find the message object corresponding to the provided id
        message = db.messages.find(message => message.id == parseInt(id));

        // Return ERROR 404: NOT FOUND if message object cannot be found
        if (!message) {
            res.status(404).json({
                error: `Couldn't find message with messageID ${id}.`
            })
        }
    }

    // Handle different use cases once message object is found
    switch (action) {
        case "edit":
            return editMessage(message, content, res);
        case "delete":
            return deleteMessage(id, res);
        case "flag":
            return flagMessage(message, flag, res);
        case "forward":
            return forwardMessage(message, loggedInId, parseInt(targetSenderId), res);
        case "inbox":
            return viewInbox(req, res);
        case "default":
            res.status(404).json({ error: "Specified action not found" });
    };
};

// Handles Edit action
function editMessage(message, content, res) {

    // Update the message content to the given content
    message.content = content;

    // Save a copy of the updated message object
    const editedMessage = { ...message };

    // Return response showing message was edited
    res.json({
        message: "VULNERABLE ACTION: UNAUTHORISED EDITING",
        data: editedMessage
    });
};

// Handles Delete action
function deleteMessage(id, res) {

    // Delete message object from messages array with corresponding id
    const editedMessages = db.messages.filter(m => m.id !== parseInt(id));

    // Return response showing message was deleted
    res.json({
        message: "VULNERABLE ACTION: UNAUTHORISED DELETION",
        data: editedMessages
    });
};

// Handles Flag action
function flagMessage(message, flag, res) {

    // Toggle flag of message object
    message.flag = flag;

    // Save copy of edited message
    const flaggedMessage = { ...message };

    // Return response showing message was flagged
    res.json({
        message: "VULNERABLE ACTION: UNAUTHORISED FLAGGING",
        data: flaggedMessage
    });
};

// Handles Forward action
function forwardMessage(message, senderId, receiverId, res) {

    // Generate message that will be forward to user to store it in db.js
    const forwardedMessage = {
        id: db.messages.length + 1,
        senderId,
        receiverId,
        content: (' ' + message.content).slice(1),
        flag: "none"
    };

    // Add forwarded message to current message in the db
    db.messages.push(forwardedMessage);

    // Return response showing message was forwarded
    res.json({
        message: "VULNERABLE ACTION: UNAUTHORISED FORWARDING",
        data: forwardedMessage
    });
};

// Handles the View Inbox action
function viewInbox(req, res) {

    // Make a copy of the current messages in the database
    const messagesCopy = { ...db.messages };

    // Return all the messages currently in the system's database without filtering those of the logged in user
    res.json({
        message: "VULNERABLE ACTION: RETRIEVING ALL MESSAGES IN DB",
        data: messagesCopy
    });
};