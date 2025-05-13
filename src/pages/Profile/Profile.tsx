import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import axiosInstance from '../../config/axiosConfig';
import './Profile.css';

// Interface for user data
interface UserProfile {
  contact: string;
  full_name: string;
  is_active: boolean;
  id: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get<UserProfile>('/users/me');
        setUserData(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="profile-header d-flex flex-col">
          <button className="back-button" onClick={handleBackToDashboard}>
            &larr;
          </button>
          <h1>My Profile</h1>
        </div>

        {isLoading ? (
          <div className="profile-loading">Loading profile...</div>
        ) : error ? (
          <div className="profile-error">{error}</div>
        ) : userData ? (
          <div className="profile-card">
            <div className="profile-avatar">
              <span>{userData.full_name.charAt(0)}</span>
            </div>
            <div className="profile-details">
              <div className="profile-field">
                <label>Full Name</label>
                <p>{userData.full_name}</p>
              </div>
              <div className="profile-field">
                <label>Contact</label>
                <p>{userData.contact}</p>
              </div>
              <div className="profile-field">
                <label>Account Status</label>
                <p className={userData.is_active ? 'status-active' : 'status-inactive'}>
                  {userData.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="profile-field">
                <label>Member Since</label>
                <p>{formatDate(userData.created_at)}</p>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="profile-error">No profile data available</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
