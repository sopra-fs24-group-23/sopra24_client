import React, { useState, useEffect, useRef, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import CustomButton from 'components/ui/CustomButton'; // Import the CustomButton
import UserContext from '../../contexts/UserContext';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  color: string;
}

interface ChatComponentProps {
  lobbyId: string;
  username: string;
  color: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ lobbyId, username, color }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const { user } = useContext(UserContext);


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
        color: color,
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-window" style={{ flex: 1, maxHeight: '300px', overflowY: 'auto', padding: '5px', borderRadius: '5px',  marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong style={{ color: msg.color }}>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-container" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!isConnected}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '3px',
            marginRight: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'black',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none'
          }}
        />
        <CustomButton
          onClick={sendMessage}
          disabled={!isConnected}
          sx={{ padding: '2px 5px', fontSize: '12px' }} // Smaller button styling
        >
          Send
        </CustomButton>
      </div>
    </div>
  );
};

export default ChatComponent;
