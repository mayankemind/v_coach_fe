import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import axiosInstance from '../../config/axiosConfig';
import './ChatStyles.css';

// Try to import ReactMarkdown, but provide a fallback if it's not available
let ReactMarkdown: React.ComponentType<{ children: string }>;
try {
  ReactMarkdown = (await import('react-markdown')).default;
} catch (e) {
  // Fallback component if react-markdown is not available
  ReactMarkdown = ({ children }: { children: string }) => (
    <div style={{ whiteSpace: 'pre-wrap' }}>{children}</div>
  );
}

// Interface for the compliance response from the API
interface ComplianceResponse {
  compliance: string;
}

interface ComplianceModalProps {
  isOpen: boolean;
  sessionId: string;
  onClose: () => void;
  onAgree: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  sessionId,
  onClose,
  onAgree
}) => {
  const [complianceText, setComplianceText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  // Fetch compliance guidelines when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGuidelines();
    }
  }, [isOpen]);

  const fetchGuidelines = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get<ComplianceResponse>('/chats/show_compliance');
      console.log("Compliance response:", response.data);
      const complianceContent = response.data.compliance || '';
      console.log("Compliance text content:", complianceContent);
      setComplianceText(complianceContent);
    } catch (err) {
      console.error('Failed to fetch compliance guidelines:', err);
      setError('Failed to load compliance guidelines. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgree = async () => {
    if (!sessionId) {
      setError('Session ID is missing. Please try again.');
      return;
    }

    setIsAcknowledging(true);
    setError('');

    try {
      await axiosInstance.post(`/chats/${sessionId}/acknowledge`);
      onAgree();
    } catch (err) {
      console.error('Failed to acknowledge compliance:', err);
      setError('Failed to acknowledge compliance. Please try again.');
    } finally {
      setIsAcknowledging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compliance Guidelines"
    >
      <div className="compliance-modal-content">
        {isLoading ? (
          <div className="loading-message">Loading guidelines...</div>
        ) : error ? (
          <div className="error-message">
            {error}
            <button
              className="retry-button"
              onClick={fetchGuidelines}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="guidelines-container">
              <h3>Please review the following guidelines:</h3>
              {complianceText ? (
                <div className="compliance-text markdown-content">
                  <ReactMarkdown>{complianceText}</ReactMarkdown>
                </div>
              ) : (
                <p>No specific guidelines available at this time.</p>
              )}
              <p className="guidelines-note">
                By clicking "I Agree" below, you acknowledge that you have read and understood these guidelines.
              </p>
            </div>
            <div className="compliance-actions">
              <button
                className="secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleAgree}
                disabled={isAcknowledging}
              >
                {isAcknowledging ? 'Processing...' : 'I Agree'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ComplianceModal;
