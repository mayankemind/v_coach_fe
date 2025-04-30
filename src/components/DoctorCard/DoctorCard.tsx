import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorCard.css';

interface DoctorCardProps {
  specialty: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ specialty }) => {
  const navigate = useNavigate();

  // Randomly choose between male and female doctor icons
  const doctorIcon = useMemo(() => {
    // Generate a random number (0 or 1)
    const randomGender = Math.floor(Math.random() * 2);
    // Return male or female doctor emoji based on the random number
    return randomGender === 0 ? '👨‍⚕️' : '👩‍⚕️';
  }, []);

  const handleClick = () => {
    navigate(`/chat/${encodeURIComponent(specialty)}`);
  };

  return (
    <div className="doctor-card" onClick={handleClick}>
      <div className="doctor-icon">{doctorIcon}</div>
      <h3>{specialty}</h3>
    </div>
  );
};

export default DoctorCard;
