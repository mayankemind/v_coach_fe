import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/Login/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import ChatPage from './pages/Chat/ChatPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Auth onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:specialty" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
