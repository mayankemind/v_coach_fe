import React, { ReactNode } from 'react';
import './styles.css';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, title }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
