import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import './styles.css';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });

    // For demo purposes, automatically log in
    onLoginSuccess();
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <AuthContainer title="Login">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email or Phone</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email or phone"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
        <p className="auth-switch">
          New user? <span onClick={onSwitchToSignup}>Sign up</span>
        </p>
      </form>
    </AuthContainer>
  );
};

export default Login;
