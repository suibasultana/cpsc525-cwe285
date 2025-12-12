// Coolors Palette: https://coolors.co/fdffff-8d6ecf-f6f5f9-ffffff-d6ccf3 
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Avatar from '@mui/material/Avatar';
import "./ChatPage.css"

export default function ChatPage() {

  const userMap = {
    1: "Suiba",
    2: "Sukhpreet",
    3: "Soila"
  }

  const avatar1 = '/icons/avatar-1.png';
  const avatar2 = '/icons/avatar-2.png';
  const avatar3 = '/icons/avatar-3.png';

  const SERVER = "http://localhost:4000/messages"
  const [mode, setmode] = useState("vulnerable");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (chat, index) => {
    setActiveChat(chat);
    setActiveIndex(index);
    console.log(chat);
  }

  useEffect(() => {
    const fetchUserInbox = async () => {
      try {
        const response = await fetch(`${SERVER}/${mode}/action`, {
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
        setActiveChat(inboxMessages.length > 0 ? inboxMessages[0] : null);
        setActiveIndex(0);

      } catch (err) {
        console.log("Error occured while fetching user's inbox: ", err)
      }
    }

    fetchUserInbox();
  }, []);

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
                className={index == activeIndex ? "chat active-chat" : "chat"}
                onClick={() => handleClick(chat, index)}
              >
                <div className="icon">
                  <Avatar alt="Profile picture of Suiba" src={
                    chat.receiverId == 1 ? avatar1 :
                      chat.receiverId == 2 ? avatar2 :
                        avatar3}
                  />
                </div>
                <div className="user">
                  <h4 style={{ marginLeft: "10px", margin: "0" }}>{userMap[chat.receiverId]}</h4>
                  <p style={{ fontSize: "18px", margin: "0" }}>{chat.conversation[0].content}</p>
                </div>
              </div>
            )))}
          </div>
          <div>
          </div>
          <div>
          </div>
        </div>
        <div className="chat-thread">
          {activeChat && (
            <>
              <div className="thread-user">
                <Avatar alt="Profile picture of Suiba" src={
                  activeChat.receiverId == 1 ? avatar1 :
                    activeChat.receiverId == 2 ? avatar2 :
                      avatar3}
                />
                <h4 style={{ marginLeft: "10px", margin: "0" }}>{userMap[activeChat.receiverId]}</h4>
              </div>
              {activeChat && activeChat.conversation.map((conv) => (
                <p className={conv.senderId ? "chat-bubble sender" : "chat-bubble receiver"}>{conv.content}</p>
              ))}
              <div className="chat-input-box">
                <TextField
                  placeholder="Type a message"
                  variant="outlined"
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: "#f7f4fb"
                    },
                  }}
                />
              </div>
            </>)}
        </div>
        <div className="col-3">Third column</div>
      </div>
    </div>
  );
}
