// This will simulate user accounts and messages.

// Vulnerable in-memory “database”
// Anyone can change message ownership by modifying IDs in requests,
// demonstrating CWE-285 (Improper Authorization).

module.exports = {
    users: [
        { id: 1, username: "suiba", password: "suiba123" },
        { id: 2, username: "sukhpreet", password: "sukhi123" },
        { id: 3, username: "soila", password: "soila123" }
    ],

    messages: [
        { id: 1, senderId: 1, receiverId: 2, content: "Hi Sukhpreet!", flag: "none" },
        { id: 2, senderId: 2, receiverId: 1, content: "Hey Suiba!", flag: "none" },
        { id: 3, senderId: 3, receiverId: 1, content: "Hello Suiba, how is the project going?", flag: "none"}
    ]
};
