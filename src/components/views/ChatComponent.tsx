import React, { useState, useContext } from "react";
import CustomButton from "components/ui/CustomButton";
import ChatContext from "../../contexts/ChatContext";
import WebSocketContext from "../../contexts/WebSocketContext";
import { isProduction } from "../../helpers/isProduction";
import UserContext from "../../contexts/UserContext";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  color: string;
}

interface ChatComponentProps {
  lobbyId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ( { lobbyId } ) => {
  const { messages, isChatSubscribed } = useContext(ChatContext)
  const { send } = useContext(WebSocketContext)
  const { user } = useContext(UserContext)
  const [inputMessage, setInputMessage] = useState<string>("");

  const sendMessage = () => {
    if (user && isChatSubscribed.current && inputMessage.trim()) {
      const chatMessage: ChatMessage = {
        sender: user.username,
        color: user.color,
        content: inputMessage,
        timestamp: new Date().toISOString()
      };
      try {
        send("/app/chat/" + lobbyId, JSON.stringify(chatMessage))
      }
      catch {
        console.error("Something went wrong trying to send a chat-message")
      }
      if (!isProduction()) console.log("Sent message: " + chatMessage)
      setInputMessage("")
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="chat-window" style={{ flex: 1, maxHeight: "300px", overflowY: "auto", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong style={{ color: msg.color }}>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-container" style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={inputMessage}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              sendMessage()
            }
          }}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "3px",
            marginRight: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none"
          }}
        />
        <CustomButton
          onClick={sendMessage}
          disabled={inputMessage === ""}
          sx={{ padding: "2px 5px", fontSize: "12px" }} // Smaller button styling
        >
          Send
        </CustomButton>
      </div>
    </div>
  );
};

export default ChatComponent;
