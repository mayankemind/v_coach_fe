import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthContainer from './AuthContainer';
import axiosInstance from '../../config/axiosConfig';
import { setAuthToken } from '../../utils/tokenUtils';
import './styles.css';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create the payload
      const payload = {
        contact,
        password
      };

      console.log('Login payload:', payload);

      // Call the login API with explicit headers
      const response = await axiosInstance.post('/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Login successful:', response.data);

      // Store the token in localStorage
      if (response.data.access_token) {
        // Use utility function to set token and expiration
        setAuthToken(response.data.access_token);
      }

      // If login is successful
      onLoginSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);

      // Simple error handling
      if (err.response && err.response.data) {
        // If we have a response with data, use the detail or message
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        // Generic error message for other cases
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Login">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
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
              placeholder="Enter your password"
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
        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch">
          New user? <span onClick={onSwitchToSignup}>Sign up</span>
        </p>
      </form>
    </AuthContainer>
  );
};

export default Login;
