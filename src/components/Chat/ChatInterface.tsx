import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import Header from '../Header/Header';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatStyles.css';

const ChatInterface: React.FC = () => {
  const { specialty } = useParams<{ specialty: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message from the doctor
  useEffect(() => {
    if (specialty) {
      const initialMessage: Message = {
        id: 'initial',
        text: `Hello, I'm Dr. Smith, a ${specialty}. How can I help you today?`,
        sender: 'doctor',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [specialty]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Simulate doctor's response after a short delay
    setTimeout(() => {
      const doctorMessage: Message = {
        id: `doctor-${Date.now()}`,
        text: generateDoctorResponse(text, specialty || ''),
        sender: 'doctor',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, doctorMessage]);
    }, 1000);
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        <h2>Chat with {specialty} Dr. Smith</h2>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

// Simple function to generate doctor responses
function generateDoctorResponse(userMessage: string, specialty: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();

  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
    return `Hello! How can I help you with your ${specialty} concerns today?`;
  }

  if (lowerCaseMessage.includes('pain')) {
    return `I understand you're experiencing pain. Could you describe where the pain is located and how severe it is on a scale of 1-10?`;
  }

  if (lowerCaseMessage.includes('medicine') || lowerCaseMessage.includes('medication')) {
    return `Before discussing any medications, I need to understand your symptoms better. Can you tell me more about what you're experiencing?`;
  }

  if (lowerCaseMessage.includes('thank')) {
    return `You're welcome! Is there anything else I can help you with?`;
  }

  // Default response
  return `That's an interesting point. As a ${specialty}, I would need to know more about your medical history to provide proper guidance. Could you share more details?`;
}

export default ChatInterface;
