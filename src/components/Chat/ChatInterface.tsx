import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import axiosInstance from "../../config/axiosConfig";
import { FaMicrophone } from "react-icons/fa";
import { BsFillMicMuteFill } from "react-icons/bs";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import "./ChatStyles.css";

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
  const gender = queryParams.get("gender") || "male";
  const nature = queryParams.get("nature") || "";
  const sessionId = queryParams.get("session_id") || "";

  // Determine doctor name and icon based on gender
  const doctorIcon = gender === "female" ? "👩‍⚕️" : "👨‍⚕️";

  useEffect(() => {
    // Initialize with empty messages array - no greeting from doctor
    setMessages([]);

    // You could add a hint message in the UI if needed, but not as a chat message
    console.log(
      `Chat started with , a ${specialty} with ${nature || "standard"} nature.`
    );
  }, [specialty, nature]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup speech recognition when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setIsRecording(false);
      }
    };
  }, []);

  // Load available voices for speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      console.log("Loaded voices:", availableVoices);
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  // Handle click outside settings modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsModalRef.current &&
        !settingsModalRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.settings-button')
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const recognitionRef = useRef<any>(null);
  const settingsModalRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Log the session ID
    console.log("Sending message with session ID:", sessionId);

    if (!sessionId) {
      console.error("No session ID available");
      setError("Session ID is missing. Please restart the chat.");
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError("");
    setTranscribedText(""); // Reset transcribed text after sending

    try {
      // Prepare the request payload
      const payload: ChatRequest = {
        session_id: sessionId,
        message: text,
      };

      // Make the API call to the chat endpoint
      const response = await axiosInstance.post<ChatResponse>(
        "/chats/chat",
        payload
      );

      console.log("Chat response:", response.data);

      // Add the doctor's response to the chat
      const doctorMessage: Message = {
        id: `doctor-${Date.now()}`,
        text: response.data.response,
        sender: "doctor",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, doctorMessage]);

      // Speak the doctor's response
      handleSpeak(response.data.response);
    } catch (err) {
      console.error("Failed to get chat response:", err);

      // Add an error message to the chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, I encountered an error processing your message. Please try again.",
        sender: "doctor",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleOnRecord = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      // Create and persist the recognition instance
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscribedText((prev) =>
          prev ? prev + " " + transcript : transcript
        );
        console.log("Transcript:", transcript);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended.");
        if (isRecording) {
          try {
            recognition.start(); // Restart recognition
            console.log("Restarting recognition...");
          } catch (e) {
            console.error("Error restarting recognition:", e);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        setError("Speech recognition error. Please try again.");
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    setIsRecording(true);
    recognitionRef.current.start();
    console.log("Starting speech recognition...");
  };

  const handleOnStopRecord = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log("Stopping speech recognition...");
    }
  };

  const toggleSpeaking = () => {
    if (!isRecording) {
      handleOnRecord();
    } else {
      handleOnStopRecord();
    }
  };

  // Function to speak text using speech synthesis
  const handleSpeak = (text: string) => {
    if (!text || text.trim() === '' || !isSpeakerOn) {
      console.warn(isSpeakerOn ? "Attempted to speak empty text" : "Speaker is turned off");
      return;
    }

    const synth = window.speechSynthesis;

    // Cancel any ongoing speech
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";

    // Log the current gender for debugging
    console.log("Current gender for voice selection:", gender);

    // Choose voice based on gender (ensure case-insensitive comparison)
    const genderLower = gender?.toLowerCase() || '';
    const preferredVoiceNames =
      genderLower === "male"
        ? ["Microsoft David", "Microsoft Mark", "Google UK English Male", "Daniel"]
        : ["Microsoft Zira", "Google UK English Female", "Samantha", "Karen"];

    console.log("Available voices:", voices);
    console.log("Preferred voice names:", preferredVoiceNames);

    const selectedVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        preferredVoiceNames.some((name) =>
          voice.name.toLowerCase().includes(name.toLowerCase())
        )
    );

    if (selectedVoice) {
      utter.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name}`);
    } else {
      console.warn("Preferred voice not found. Using default.");
      // Try to at least select an English voice
      const englishVoice = voices.find(voice => voice.lang.startsWith("en"));
      if (englishVoice) {
        utter.voice = englishVoice;
        console.log(`Falling back to English voice: ${englishVoice.name}`);
      }
    }

    // Add event listeners for debugging
    utter.onstart = () => console.log("Speech started");
    utter.onend = () => console.log("Speech ended");
    utter.onerror = (event) => console.error("Speech error:", event);

    synth.speak(utter);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <div className="doctor-header">
            <span className="doctor-header-icon">{doctorIcon}</span>
            <h2>Sales Pitch</h2>
          </div>
        </div>
        <div className="settings">
          <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            <CiSettings />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal" ref={settingsModalRef}>
          <div className="settings-modal-content">
            <h3>Settings</h3>
            <div className="settings-option">
              <label htmlFor="speaker-toggle">Text-to-Speech</label>
              <button
                className="speaker-toggle"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                aria-label={isSpeakerOn ? "Turn off speaker" : "Turn on speaker"}
              >
                {isSpeakerOn ? <VscUnmute /> : <VscMute />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="chat-hint">
            <p>
              You are now chatting with, a {nature} {gender} {specialty}.
            </p>
            <p>
              As a medical representative, you can start the conversation by
              introducing yourself and your product.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error-message">{error}</div>}
      <div className="chat-input-feedback-container">
        <div className="input-with-mic">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            transcribedText={transcribedText}
          />
          <button
            className={`customized_btn speak-btn ${
              isRecording ? "speaking" : ""
            }`}
            type="button"
            onClick={toggleSpeaking}
            aria-label={isRecording ? "Stop voice input" : "Start voice input"}
          >
            {isRecording ? <BsFillMicMuteFill /> : <FaMicrophone />}
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
