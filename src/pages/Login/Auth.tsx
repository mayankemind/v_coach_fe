import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Header from '../../components/Header/Header';
import './styles.css';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const location = useLocation();

  // Check if we were redirected from a protected route
  const from = location.state?.from?.pathname || '/dashboard';

  const switchToSignup = () => {
    setIsLoginView(false);
  };

  const switchToLogin = () => {
    setIsLoginView(true);
  };

  return (
    <div className="auth-page-container">
      <Header showLogout={false} />
      <div className="auth-page">
        {isLoginView ? (
          <Login onSwitchToSignup={switchToSignup} onLoginSuccess={onLoginSuccess} />
        ) : (
          <Signup onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default Auth;
