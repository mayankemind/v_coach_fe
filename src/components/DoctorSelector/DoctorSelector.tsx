import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenderSelector from './GenderSelector';
import SpecialtySelector from './SpecialtySelector';
import NatureSelector from './NatureSelector';
import Modal from '../Modal/Modal';
import ComplianceModal from '../Chat/ComplianceModal';
import axiosInstance from '../../config/axiosConfig';
import './DoctorSelector.css';

// Interface for session creation response
interface SessionResponse {
  session_id: string;
}

const DoctorSelector: React.FC = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [specialty, setSpecialty] = useState('');
  const [nature, setNature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const handleStartChat = async () => {
    if (!specialty) {
      setError('Please select a doctor specialty');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Create a session
      const payload = {
        specialty,
        nature: nature || 'Friendly', // Default to Friendly if not selected
        gender: gender.charAt(0).toUpperCase() + gender.slice(1) // Capitalize first letter
      };

      console.log('Creating session with:', payload);

      const response = await axiosInstance.post<SessionResponse>('/chats/sessions', payload);

      console.log('Session created:', response.data);

      // Store the session ID
      setSessionId(response.data.session_id);

      // Step 2: Show compliance guidelines modal
      setShowComplianceModal(true);
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to start chat. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleComplianceAgree = () => {
    // Close the compliance modal
    setShowComplianceModal(false);

    // Navigate to chat with session ID and parameters
    const params = new URLSearchParams();
    params.append('specialty', specialty);
    params.append('gender', gender);
    params.append('session_id', sessionId);
    if (nature) params.append('nature', nature);

    navigate(`/chat/${specialty}?${params.toString()}`);
  };

  const handleComplianceCancel = () => {
    setShowComplianceModal(false);
  };

  return (
    <div className="doctor-selector">
      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        title="Error"
      >
        <div className="error-modal-content">
          <p>{error}</p>
          <button
            className="primary-button"
            onClick={handleCloseErrorModal}
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Compliance Guidelines Modal */}
      <ComplianceModal
        isOpen={showComplianceModal}
        sessionId={sessionId}
        onClose={handleComplianceCancel}
        onAgree={handleComplianceAgree}
      />

      <div className="selector-container">
        <GenderSelector selectedGender={gender} onGenderChange={setGender} />
        <SpecialtySelector selectedSpecialty={specialty} onSpecialtyChange={setSpecialty} />
        <NatureSelector selectedNature={nature} onNatureChange={setNature} />

        <div className="chat-button-container">
          <button
            className="chat-button"
            onClick={handleStartChat}
            disabled={!specialty || isLoading}
          >
            {isLoading ? 'Starting...' : 'Let\'s Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSelector;
