import React from 'react';
import Header from '../../components/Header/Header';
import ChatInterface from '../../components/Chat/ChatInterface';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  return (
    <div className="chat-page">
      <Header />
      <div className="chat-page-content">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
