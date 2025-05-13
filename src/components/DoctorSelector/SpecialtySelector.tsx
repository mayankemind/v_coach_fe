import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import SelectionCard from '../SelectionCard/SelectionCard';
import axiosInstance from '../../config/axiosConfig';
import './DoctorSelector.css';

// Interface for doctor specialty
interface DoctorSpecialty {
  name: string;
  id: string;
  created_at: string;
}

interface SpecialtySelectorProps {
  selectedSpecialty: string;
  onSpecialtyChange: (specialty: string) => void;
}

const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ selectedSpecialty, onSpecialtyChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specialties, setSpecialties] = useState<DoctorSpecialty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch specialties from API
  useEffect(() => {
    const fetchSpecialties = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get<DoctorSpecialty[]>('/doctors/specialities');
        setSpecialties(response.data);
      } catch (err) {
        console.error('Failed to fetch specialties:', err);
        setError('Failed to load specialties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSpecialtySelect = (specialty: string) => {
    onSpecialtyChange(specialty);
    closeModal();
  };

  return (
    <div className="selector-section">
      <h3 className="selector-title">Specialty</h3>
      <div className="selector-content">
        <button
          className="selector-button"
          onClick={openModal}
        >
          {selectedSpecialty || 'Select Specialty'}
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Select Doctor Specialty"
        >
          <div className="selection-grid">
            {isLoading ? (
              <div className="loading-message">Loading specialties...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              specialties.map((specialty) => (
                <SelectionCard
                  key={specialty.id}
                  label={specialty.name}
                  isSelected={selectedSpecialty === specialty.name}
                  onClick={() => handleSpecialtySelect(specialty.name)}
                />
              ))
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SpecialtySelector;
