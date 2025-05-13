import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/Login/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import ChatPage from './pages/Chat/ChatPage'
import Profile from './pages/Profile/Profile'
import FeedbackPage from './pages/Feedback/FeedbackPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ExpirationWarning from './components/ExpirationWarning/ExpirationWarning'
import { isTokenExpired, clearAuthToken, getTokenTimeRemaining, formatTimeRemaining } from './utils/tokenUtils'

function App() {
  // Check if user is authenticated
  const isUserAuthenticated = (): boolean => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) return false;

    // Check if token is expired
    if (isTokenExpired()) {
      // Clear authentication data
      clearAuthToken();
      return false;
    }

    return true;
  };

  // Initialize authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return isUserAuthenticated();
  });

  // State for token expiration notification
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [expirationMessage, setExpirationMessage] = useState('');

  // Check for token expiration on app load and set up periodic checks
  useEffect(() => {
    // Function to check token expiration
    const checkTokenExpiration = () => {
      // Check if user is still authenticated
      const isStillAuthenticated = isUserAuthenticated();
      if (isAuthenticated !== isStillAuthenticated) {
        setIsAuthenticated(isStillAuthenticated);

        // If no longer authenticated due to token expiration, show message
        if (!isStillAuthenticated && localStorage.getItem('isAuthenticated') === 'false') {
          // This means the token has expired
          alert('Your session has expired. Please log in again.');
          return;
        }
      }

      // If still authenticated, check how much time is left
      if (isStillAuthenticated) {
        const timeRemaining = getTokenTimeRemaining();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // Show warning if less than 1 day remaining
        if (timeRemaining < oneDayInMs) {
          setShowExpirationWarning(true);
          setExpirationMessage(`Your session will expire in ${formatTimeRemaining(timeRemaining)}`);
        } else {
          setShowExpirationWarning(false);
        }
      }
    };

    // Check token expiration immediately on app load
    checkTokenExpiration();

    // Set up periodic checks for token expiration (every 15 minutes)
    const tokenCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 15 * 60 * 1000); // 15 minutes

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  // Function to dismiss the expiration warning
  const dismissWarning = () => {
    setShowExpirationWarning(false);
  };

  return (
    <div className="app">
      {/* Show expiration warning if token is about to expire */}
      {showExpirationWarning && (
        <ExpirationWarning
          message={expirationMessage}
          onClose={dismissWarning}
        />
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <Auth onLoginSuccess={handleLoginSuccess} />
            }
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat/:specialty" element={<ChatPage />} />
            <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <BrowserRouter>
        <Routes>
            <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  )
}

export default App
