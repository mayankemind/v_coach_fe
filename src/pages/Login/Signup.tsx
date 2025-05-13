import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContainer from './AuthContainer';
import Modal from '../../components/Modal/Modal';
import axiosInstance from '../../config/axiosConfig';
import './styles.css';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSwitchToLogin();
  };

  // Interface for signup response
  interface SignupResponse {
    user: {
      contact: string;
      full_name: string;
      is_active: boolean;
      id: string;
      created_at: string;
    };
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number format (only digits)
    if (!/^\d+$/.test(contact)) {
      setError('Phone number should contain only digits');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    // Create the payload exactly as expected by the backend
    const payload = {
      contact,
      full_name: fullName,
      is_active: true,
      password,
      confirm_password: confirmPassword
    };

    console.log('Signup payload:', payload);

    try {
      // Call the signup API with explicit headers
      const response = await axiosInstance.post<SignupResponse>('/auth/signup', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Signup successful:', response.data);

      // If signup is successful, show success message with the user's name
      const userName = response.data.user.full_name;
      setSuccessMessage(`Signup successful for ${userName}! Please login with your credentials.`);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Signup error:', err);

      // Simple error handling
      if (err.response && err.response.data) {
        // If we have a response with data, use the detail or message
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Signup failed. Please check your information and try again.');
        }
      } else {
        // Generic error message for other cases
        setError('Signup failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Sign Up">
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Signup Successful"
      >
        <div className="success-message">
          <p>{successMessage}</p>
          <button
            className="auth-button"
            onClick={handleCloseSuccessModal}
          >
            Continue to Login
          </button>
        </div>
      </Modal>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Phone Number</label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="auth-switch">
          Already have an account? <span onClick={onSwitchToLogin}>Login</span>
        </p>
      </form>
    </AuthContainer>
  );
};

export default Signup;
