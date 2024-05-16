import React, { useContext, useRef, useState } from "react";
import ChatContext from "../../contexts/ChatContext";
import WebSocketContext from "../../contexts/WebSocketContext";
import PropTypes from "prop-types";

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const currentLobbyId = useRef("")
  const isChatSubscribed = useRef(false)
  const { subscribeClient, unsubscribeClient } = useContext(WebSocketContext)

  const connectChat = (lobbyId: string) => {
    currentLobbyId.current = lobbyId
    isChatSubscribed.current = true;
    subscribeClient("/topic/chat/" + lobbyId, (message) => {
      const received = JSON.parse(message.body)
      console.log("DEBUG received message" + message.body)
      setMessages((prevMessages) => [...prevMessages, received])
    })
  }

  const resetChat = () => {
    unsubscribeClient("/topic/chat" + currentLobbyId)
    setMessages([])
  }

  return (
    <ChatContext.Provider value={{ messages, connectChat, isChatSubscribed, resetChat }}>
      {children}
    </ChatContext.Provider>
  )
}

ChatProvider.propTypes = {
  children: PropTypes.node,
};

export default ChatProvider;