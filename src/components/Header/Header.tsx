import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="logo">
        <h1>V Coach</h1>
      </div>
      <div className="profile">
        <div className="profile-icon">
          <span>👤</span>
        </div>
        {/* <span className="profile-text">Profile</span> */}
        <span className="profile-text"><GiHamburgerMenu /></span>
      </div>
    </header>
  );
};

export default Header;
