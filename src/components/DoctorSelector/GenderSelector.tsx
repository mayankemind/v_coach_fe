import React from 'react';
import './DoctorSelector.css';

interface GenderSelectorProps {
  selectedGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onGenderChange }) => {
  const handleGenderChange = (gender: 'male' | 'female') => {
    onGenderChange(gender);
  };

  return (
    <div className="selector-section">
      <h3 className="selector-title">Gender</h3>
      <div className="selector-content">
        <div className="gender-options">
          <label className={`gender-option ${selectedGender === 'male' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="gender"
              checked={selectedGender === 'male'}
              onChange={() => handleGenderChange('male')}
            />
            <div className="gender-icon">👨‍⚕️</div>
            {/* <span>Male</span> */}
          </label>

          <label className={`gender-option ${selectedGender === 'female' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="gender"
              checked={selectedGender === 'female'}
              onChange={() => handleGenderChange('female')}
            />
            <div className="gender-icon">👩‍⚕️</div>
            {/* <span>Female</span> */}
          </label>
        </div>
      </div>
    </div>
  );
};

export default GenderSelector;
