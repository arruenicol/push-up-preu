// frontend/src/components/Notification/NotificationList.jsx
import React, { useEffect, useState } from 'react';
import { 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../../services/notificationStorage';

import './NotificationList.css';

const NotificationList = ({ onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notifications from localStorage on component mount
    loadNotifications();
    
    // Set up event listeners
    const handleNotificationReceived = () => {
      loadNotifications();
    };
    
    const handleServiceWorkerMessage = (event) => {
      // Handle messages from service worker
      if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
        loadNotifications();
      } else if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
        handleNotificationRead(event.data.notificationId);
      }
    };
    
    // Listen for notification events
    window.addEventListener('notificationReceived', handleNotificationReceived);
    
    // Listen for messages from service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('notificationReceived', handleNotificationReceived);
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    const storedNotifications = getStoredNotifications();
    setNotifications(storedNotifications);
    setLoading(false);
  };

  const handleNotificationRead = (notificationId) => {
    const updatedNotifications = markNotificationAsRead(notificationId);
    setNotifications(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllNotificationsAsRead();
    setNotifications(updatedNotifications);
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedNotifications = deleteNotification(notificationId);
    setNotifications(updatedNotifications);
  };

  const handleClearAll = () => {
    const updatedNotifications = clearAllNotifications();
    setNotifications(updatedNotifications);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h1>Notifications</h1>
        <div className="notification-actions">
          <button 
            className="btn-mark-all-read" 
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
          >
            Mark All as Read
          </button>
          <button 
            className="btn-clear-all" 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="notification-loading">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="notification-empty">
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => handleNotificationRead(notification.id)}
            >
              <div className="notification-content">
                <div className="notification-header-row">
                  <h3 className="notification-title">{notification.title}</h3>
                  <button 
                    className="btn-delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    &times;
                  </button>
                </div>
                <p className="notification-body">{notification.body}</p>
                <div className="notification-metadata">
                  <span className="notification-timestamp">
                    {formatDate(notification.timestamp)}
                  </span>
                  {!notification.read && (
                    <span className="notification-unread-badge">New</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;