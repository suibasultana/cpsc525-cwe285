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
        message: "VULNERABLE ACTION: UNAUTHORIZED EDITING",
        data: editedMessage
    });
};

// Handles Delete action
function deleteMessage(id, res) {

    // Delete message object from messages array with corresponding id
    const editedMessages = db.messages.filter(m => m.id !== parseInt(id));

    // Return response showing message was deleted
    res.json({
        message: "VULNERABLE ACTION: UNAUTHORIZED DELETION",
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
        message: "VULNERABLE ACTION: UNAUTHORIZED FLAGGING",
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
        message: "VULNERABLE ACTION: UNAUTHORIZED FORWARDING.",
        data: forwardedMessage
    });
};

// Handles the View Inbox action.
function viewInbox(req, res) {

    console.log("VIEW BOX ACTION HIT!")
    
    // Making a copy of the current messages in the database.
    const messagesCopy = { ...db.messages };

    // Returning all the messages currently in the system's database without filtering those of the logged in user.
    res.json({
        message: "VULNERABLE ACTION: RETRIEVING ALL MESSAGES IN DB",
        data: messagesCopy
    });
};





// ======================== SECURE HELPER FUNCTIONS ========================

function getLoggedInUserId(req, res) {
    if (!req.session || !req.session.userId) {
        res.status(401).json({ error: "Not authenticated." });
        return null;
    }
    return req.session.userId;
}

function findMessageByIdOrSendError(id, res) {
    const messageId = parseInt(id, 10);

    if (Number.isNaN(messageId)) {
        res.status(400).json({ error: "Invalid message id." });
        return null;
    }

    const msg = db.messages.find(m => m.id === messageId);

    if (!msg) {
        res.status(404).json({ error: "Message not found." });
        return null;
    }

    return msg;
}

function userCanAccessMessage(userId, msg) {
    return msg.senderId === userId || msg.receiverId === userId;
}




// ======================== SECURE ENDPOINTS ========================

// Secure version of viewMessage
exports.viewMessageSecure = (req, res) => {
    const userId = getLoggedInUserId(req, res);
    if (!userId) return;

    const msg = findMessageByIdOrSendError(req.params.id, res);
    if (!msg) return;

    if (!userCanAccessMessage(userId, msg)) {
        return res.status(403).json({
            error: "Access denied: you are not allowed to view this message."
        });
    }

    res.json({
        message: "SECURE ENDPOINT",
        details: msg
    });
};



// Secure version of handleAction.
exports.handleActionSecure = (req, res) => {
    const userId = getLoggedInUserId(req, res);
    if (!userId) return;

    let message = null;

    const { action, id, content, flag, targetSenderId } = req.body;

    // Actions that need a specific message.
    const actionsRequiringMessage = ["edit", "delete", "flag", "forward"];

    if (actionsRequiringMessage.includes(action)) {
        if (!id) {
            return res.status(400).json({ error: "Message id is required for this action." });
        }

        message = findMessageByIdOrSendError(id, res);
        if (!message) return;

        if (!userCanAccessMessage(userId, message)) {
            return res.status(403).json({
                error: "Access denied: you cannot modify this message."
            });
        }
    }

    switch (action) {
        case "edit":
            return secureEditMessage(message, content, res);

        case "delete":
            return secureDeleteMessage(id, res);

        case "flag":
            return secureFlagMessage(message, flag, res);

        case "forward":
            return secureForwardMessage(message, userId, parseInt(targetSenderId, 10), res);

        case "inbox":
            return secureViewInbox(userId, res);

        default:
            return res.status(404).json({ error: "Specified action not found." });
    }
};



// ================== SECURE ACTION IMPLEMENTATIONS ==================

function secureEditMessage(message, content, res) {
    if (!content) {
        return res.status(400).json({ error: "New content is required to edit message." });
    }

    message.content = String(content);
    const editedMessage = { ...message };

    res.json({
        message: "SECURE ACTION: message edited.",
        data: editedMessage
    });
}

function secureDeleteMessage(id, res) {
    const messageId = parseInt(id, 10);

    const index = db.messages.findIndex(m => m.id === messageId);
    if (index === -1) {
        return res.status(404).json({ error: "Message not found." });
    }

    const deleted = db.messages[index];
    db.messages.splice(index, 1);

    res.json({
        message: "SECURE ACTION: message deleted.",
        data: deleted
    });
}

function secureFlagMessage(message, flag, res) {
    if (!flag) {
        return res.status(400).json({ error: "Flag value is required." });
    }

    message.flag = String(flag);
    const flaggedMessage = { ...message };

    res.json({
        message: "SECURE ACTION: message flagged.",
        data: flaggedMessage
    });
}

function secureForwardMessage(message, senderId, receiverId, res) {
    if (!receiverId) {
        return res.status(400).json({ error: "Target receiverId is required." });
    }

    const forwardedMessage = {
        id: db.messages.length + 1,
        senderId,
        receiverId,
        content: (' ' + message.content).slice(1),
        flag: "none"
    };

    db.messages.push(forwardedMessage);

    res.json({
        message: "SECURE ACTION: message forwarded.",
        data: forwardedMessage
    });
}

function secureViewInbox(userId, res) {
    const userMessages = db.messages.filter(
        m => m.senderId === userId || m.receiverId === userId
    );

    res.json({
        message: "SECURE ACTION: inbox for current user.",
        data: userMessages
    });
}
