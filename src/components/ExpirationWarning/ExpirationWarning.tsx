import React from 'react';
import './ExpirationWarning.css';

interface ExpirationWarningProps {
  message: string;
  onClose: () => void;
}

const ExpirationWarning: React.FC<ExpirationWarningProps> = ({ message, onClose }) => {
  return (
    <div className="expiration-warning">
      <div className="expiration-warning-content">
        <span className="expiration-warning-icon">⚠️</span>
        <span className="expiration-warning-message">{message}</span>
        <button className="expiration-warning-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ExpirationWarning;
