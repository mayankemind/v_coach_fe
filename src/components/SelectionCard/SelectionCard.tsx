import React from 'react';
import './SelectionCard.css';

interface SelectionCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ label, isSelected, onClick }) => {
  return (
    <div 
      className={`selection-card ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <span>{label}</span>
    </div>
  );
};

export default SelectionCard;
