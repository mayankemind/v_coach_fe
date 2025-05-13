import React, { useState } from 'react';
import './ChatStyles.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button
          type="submit"
          className={`customized_btn send-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          <span className="send-icon">
            {isLoading ? '...' : '➤'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
