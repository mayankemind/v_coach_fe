import React from 'react';
import './ChatStyles.css';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'doctor-message'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <span className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
