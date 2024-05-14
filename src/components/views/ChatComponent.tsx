import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatComponentProps {
  lobbyId: string;
  username: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ lobbyId, username }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      stompClient.subscribe(`/topic/messages`, (message) => {
        const msg: ChatMessage = JSON.parse(message.body);
        console.log('Received message:', msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        setIsConnected(false);
      }
    };
  }, [lobbyId]);

  const sendMessage = () => {
    if (newMessage.trim() && isConnected) {
      const chatMessage: ChatMessage = {
        sender: username, // Use the actual sender's username
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: "/app/sendMessage",
          body: JSON.stringify(chatMessage)
        });
        console.log('Sent message:', chatMessage);
      } else {
        console.error('STOMP client is not connected');
      }
      setNewMessage('');
    } else {
      console.error('Cannot send message, STOMP client is not connected or message is empty');
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
