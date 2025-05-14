// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css' 

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotificationList from './components/Notification/NotificationList';

import { initializePushNotifications } from './services/push';
import { notificationService } from './services/api';
import Header from './components/Header/Header';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [pushInitialized, setPushInitialized] = useState(false);
  // We'll still track notifications that arrive when the app is in the foreground
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check authentication status when the component mounts
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    const setupPushNotifications = async () => {
      if (!isAuthenticated || pushInitialized) return;

      try {
        console.log('Setting up push notifications...');
        const result = await initializePushNotifications();
        
        if (result.success && result.token) {
          console.log('FCM token ready:', result.token);
          
          // Register the FCM token with your backend
          try {
            await notificationService.registerPushToken(result.token);
            console.log('FCM token registered with backend successfully');
            setPushInitialized(true);
          } catch (error) {
            console.error('Failed to register FCM token with backend:', error);
          }
        } else {
          console.warn('Push setup failed:', result.message);
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();
  }, [isAuthenticated, pushInitialized]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Reset push initialization state to ensure it's set up after login
    setPushInitialized(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPushInitialized(false);
    setNotifications([]);
  };

  return (
    <Router>
      <Header/>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/notifications" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/notifications" /> : <Register />}
        />

        {/* Protected Route */}
        <Route
          path="/notifications"
          element={
            isAuthenticated ? 
              <NotificationList 
                onLogout={handleLogout} 
                notifications={notifications}
                setNotifications={setNotifications}
              /> : 
              <Navigate to="/login" />
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/notifications" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;