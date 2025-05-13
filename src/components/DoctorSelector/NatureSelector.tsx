import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import SelectionCard from '../SelectionCard/SelectionCard';
import axiosInstance from '../../config/axiosConfig';
import './DoctorSelector.css';

// Interface for doctor nature
interface DoctorNature {
  nature_type: string;
  emoji: string;
  id: string;
  created_at: string;
}

interface NatureSelectorProps {
  selectedNature: string;
  onNatureChange: (nature: string) => void;
}

const NatureSelector: React.FC<NatureSelectorProps> = ({ selectedNature, onNatureChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorNatures, setDoctorNatures] = useState<DoctorNature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fallback doctor natures in case API fails
  const fallbackNatures: DoctorNature[] = [
    { nature_type: 'Busy', emoji: '⏱️', id: '1', created_at: '' },
    { nature_type: 'Detailed', emoji: '📋', id: '2', created_at: '' },
    { nature_type: 'Distracted', emoji: '🤔', id: '3', created_at: '' },
    { nature_type: 'Empathetic', emoji: '💗', id: '4', created_at: '' }
  ];

  // Fetch doctor natures from API
  useEffect(() => {
    const fetchDoctorNatures = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get<DoctorNature[]>('/doctors/natures');
        if (response.data && response.data.length > 0) {
          setDoctorNatures(response.data);
        } else {
          // If API returns empty array, use fallback
          console.warn('API returned empty doctor natures, using fallback data');
          setDoctorNatures(fallbackNatures);
        }
      } catch (err) {
        console.error('Failed to fetch doctor natures:', err);
        setError('Failed to load doctor natures. Using default values.');
        // Use fallback data if API call fails
        setDoctorNatures(fallbackNatures);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorNatures();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNatureSelect = (nature: string) => {
    onNatureChange(nature);
    closeModal();
  };

  // Find the selected nature object to display the emoji
  const selectedNatureObj = doctorNatures.find(n => n.nature_type === selectedNature);
  const displayText = selectedNature
    ? `${selectedNatureObj?.emoji} ${selectedNature}`
    : 'Select Nature';

  return (
    <div className="selector-section">
      <h3 className="selector-title">Nature</h3>
      <div className="selector-content">
        <button
          className="selector-button"
          onClick={openModal}
        >
          {displayText}
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Select Doctor Nature"
        >
          <div className="selection-grid">
            {isLoading ? (
              <div className="loading-message">Loading doctor natures...</div>
            ) : error ? (
              <div className="error-message">
                {error}
                <button
                  className="retry-button"
                  onClick={() => {
                    // Re-run the useEffect by forcing a re-render
                    setError('');
                    setIsLoading(true);
                    // Fetch doctor natures again
                    axiosInstance.get<DoctorNature[]>('/doctors/natures')
                      .then(response => {
                        if (response.data && response.data.length > 0) {
                          setDoctorNatures(response.data);
                        } else {
                          setDoctorNatures(fallbackNatures);
                        }
                        setIsLoading(false);
                      })
                      .catch(err => {
                        console.error('Retry failed:', err);
                        setDoctorNatures(fallbackNatures);
                        setError('Failed to load doctor natures. Using default values.');
                        setIsLoading(false);
                      });
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              doctorNatures.map((nature) => (
                <SelectionCard
                  key={nature.id}
                  label={`${nature.emoji} ${nature.nature_type}`}
                  isSelected={selectedNature === nature.nature_type}
                  onClick={() => handleNatureSelect(nature.nature_type)}
                />
              ))
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NatureSelector;
