// Coolors Palette: https://coolors.co/fdffff-8d6ecf-f6f5f9-ffffff-d6ccf3 
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Avatar from '@mui/material/Avatar';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import "./ChatPage.css"

export default function ChatPage() {

  const userMap = {
    1: { name: "Suiba", email: "emailsuiba@live.ca" },
    2: { name: "Sukhpreet", email: "emailsukhpreet@live.ca" },
    3: { name: "Soila", email: "emailsoila@live.ca" }
  }

  const avatar1 = '/icons/avatar-1.png';
  const avatar2 = '/icons/avatar-2.png';
  const avatar3 = '/icons/avatar-3.png';

  const SERVER = "http://localhost:4000"

  const [mode, setMode] = useState("secure");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");

  const handleClick = (chat, index) => {
    setActiveChat(chat);
    setActiveIndex(index);
    console.log(chat);
  }

  const handleToggle = () => {
    setMode(prev => prev === "vulnerable" ? "secure" : "vulnerable");
  }

  const handleSend = async () => {

    try {
      console.log("Message ID: ", activeChat.id);

      const response = await fetch(`${SERVER}/messages/${mode}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: activeChat.id,
          action: "respond",
          content: message
        })
      });

      const data = await response.json();
      const newMessage = data.data;

      console.log("Response from backend: ", newMessage);

      // Update chat to reflect the new data from the backend
      setChats(prev =>
        prev.map(c =>
          c.id === activeChat.id
            ? { ...c, conversation: [...c.conversation, newMessage] }
            : c
        )
      );

      // update active chat too
      setActiveChat(prev => ({
        ...prev,
        conversation: [...prev.conversation, newMessage]
      }));

      setMessage("");

    } catch (err) {
      console.log(`Error occured while sending message to ${userMap[activeChat.receiverId].name} : ${err}`)
    }

  }

  useEffect(() => {
    const fetchUserInbox = async () => {
      try {
        const response = await fetch(`${SERVER}/messages/${mode}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "inbox"
          })
        });

        const data = await response.json();
        const inboxMessages = Object.values(data.data || {});

        setChats(inboxMessages);
        console.log("Inbox messages: ", inboxMessages);
        setActiveChat(inboxMessages.length > 0 ? inboxMessages[0] : null);
        setActiveIndex(0);

      } catch (err) {
        console.log("Error occured while fetching user's inbox: ", err)
      }
    }

    fetchUserInbox();
  }, [mode]);

  useEffect(() => {
    console.log("Fetched inbox from backend!");
    console.log(chats);
  }, [chats, activeChat])

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="col-1">
          <h1 className="chat-heading">ChatWithMe</h1>
          <div className="search-bar">
            <TextField
              placeholder="Search"
              variant="outlined"
              sx={{
                width: "230px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "#f7f4fb"
                },
              }}
            />
          </div>
          <div className="inbox">
            {chats && (chats.map((chat, index) => (
              <div
                key={index}
                className={index === activeIndex ? "chat active-chat" : "chat"}
                onClick={() => handleClick(chat, index)}
              >
                <div className="icon">
                  <Avatar alt="Profile picture of Suiba" src={
                    chat.receiverId === 1 ? avatar1 :
                      chat.receiverId === 2 ? avatar2 :
                        avatar3}
                  />
                </div>
                <div className="user">
                  <h4 style={{ marginLeft: "10px", margin: "0" }}>{userMap[chat.receiverId].name}</h4>
                  <p style={{ fontSize: "18px", margin: "0" }}>{chat.conversation[0].content}</p>
                </div>
              </div>
            )))}
          </div>
          <div className="toggle-switch">
            <FormControlLabel control={<Switch defaultChecked />} label="Secure Mode" onClick={handleToggle} />
          </div>
        </div>
        <div className="col-2">
          {activeChat && (
            <>
              <div className="thread-user">
                <Avatar alt="Profile picture of Suiba" src={
                  activeChat.receiverId === 1 ? avatar1 :
                    activeChat.receiverId === 2 ? avatar2 :
                      avatar3}
                />
                <h4 style={{ marginLeft: "10px", margin: "0" }}>{userMap[activeChat.receiverId].name}</h4>
              </div>
              <div className="chat-thread">
                {activeChat && activeChat.conversation.map((conv, index) => (
                  <p key={index} className={index % 2 === 0 ? "chat-bubble sender" : "chat-bubble receiver"}>{conv.content}</p>
                ))}
              </div>
              <div className="chat-input-box">
                <TextField
                  placeholder="Write a message..."
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: "#f7f4fb"
                    },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <>
                          <div style={{ color: "#b3b3b3", marginRight: "8px", display: "flex", flexDirection: "row", rowGap: "4px" }}>
                            <EmojiEmotionsIcon style={{ cursor: "pointer" }} />
                            <AttachFileIcon style={{ cursor: "pointer" }} />
                          </div>
                          <SendIcon style={{ color: "#9c6be8", cursor: "pointer" }} onClick={handleSend} />
                        </>
                      ),
                    },
                  }}
                />
              </div>
            </>)}
        </div>
        <div className="col-3">
          {activeChat && (
            <div className="contact">
              <Avatar alt="Profile picture of Suiba" src={
                activeChat.receiverId === 1 ? avatar1 :
                  activeChat.receiverId === 2 ? avatar2 :
                    avatar3}
                sx={{ width: 200, height: 200 }}
              />
              <h3 style={{ margin : "0" }}>{userMap[activeChat.receiverId].name}</h3>
              <p style={{ margin : "0 0 20px 0" }}>{userMap[activeChat.receiverId].email}</p>
              <div className="action-buttons">
                <button className="call-btn">Call</button>
                <button className="block-btn">Block</button>
              </div>
            </div>)
          }
        </div>
      </div>
    </div>
  );
}
