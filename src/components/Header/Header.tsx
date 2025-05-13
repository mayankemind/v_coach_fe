import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { clearAuthToken } from '../../utils/tokenUtils';
import './Header.css';

interface HeaderProps {
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLogout = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    if (showLogout) {
      setShowMenu(!showMenu);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');

    window.location.reload();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="main-header">
      <div className="logo">
        <h1>V Coach</h1>
      </div>
      <div className="profile" ref={menuRef}>
        {showLogout && (
          <>
            <div className="profile-icon" onClick={handleProfileClick}>
              <span>👤</span>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
              <GiHamburgerMenu />
            </div>

            {showMenu && (
              <div className="profile-menu">
                <div className="menu-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
