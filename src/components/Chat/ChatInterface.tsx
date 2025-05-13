import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';
import axiosInstance from '../../config/axiosConfig';
import { FaMicrophone } from "react-icons/fa";
import './ChatStyles.css';

// Interface for chat API request
interface ChatRequest {
  session_id: string;
  message: string;
}

// Interface for chat API response
interface ChatResponse {
  session_id: string;
  response: string;
  compliance_status: string;
}

const ChatInterface: React.FC = () => {
  const { specialty } = useParams<{ specialty: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const gender = queryParams.get('gender') || 'male';
  const nature = queryParams.get('nature') || '';
  const sessionId = queryParams.get('session_id') || '';

  // Determine doctor name and icon based on gender
  const doctorIcon = gender === 'female' ? '👩‍⚕️' : '👨‍⚕️';

  useEffect(() => {
    // Initialize with empty messages array - no greeting from doctor
    setMessages([]);

    // You could add a hint message in the UI if needed, but not as a chat message
    console.log(`Chat started with , a ${specialty} with ${nature || 'standard'} nature.`);
  }, [specialty, nature]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Log the session ID
    console.log('Sending message with session ID:', sessionId);

    if (!sessionId) {
      console.error('No session ID available');
      setError('Session ID is missing. Please restart the chat.');
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      // Prepare the request payload
      const payload: ChatRequest = {
        session_id: sessionId,
        message: text
      };

      // Make the API call to the chat endpoint
      const response = await axiosInstance.post<ChatResponse>('/chats/chat', payload);

      console.log('Chat response:', response.data);

      // Add the doctor's response to the chat
      const doctorMessage: Message = {
        id: `doctor-${Date.now()}`,
        text: response.data.response,
        sender: 'doctor',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, doctorMessage]);
    } catch (err) {
      console.error('Failed to get chat response:', err);

      // Add an error message to the chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'doctor',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        <div className="doctor-header">
          <span className="doctor-header-icon">{doctorIcon}</span>
          <h2>Practice your Sales Pitch</h2>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="chat-hint">
            <p>You are now chatting with, a {specialty}.</p>
            <p>As a medical representative, you can start the conversation by introducing yourself and your product.</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error-message">{error}</div>}
      <div className="chat-input-feedback-container">
        <div className="input-with-mic">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <button className="customized_btn speak-btn" type="button" aria-label="Voice input">
            <FaMicrophone />
          </button>
        </div>
        <button
          className="feedback-button"
          onClick={() => navigate(`/feedback/${sessionId}`)}
          disabled={!sessionId}
        >
          Feedback
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
