// frontend/src/components/Notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/api';
import { authService } from '../../services/api';


const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getMyNotifications();
        setNotifications(response.data.results || response.data);
      } catch (err) {
        setError('Error al cargar notificaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule':
        return (
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'room':
        return (
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        );
      case 'news':
        return (
          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        );
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-4">
        <p className="text-center text-gray-500">
          No tienes notificaciones por el momento.
        </p>
        <br />
        <button onClick={() => {
            authService.logout();
            window.location.href = '/login'; // or use useNavigate() if using React Router
        }}>
            Log Out
        </button>

      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-indigo-600">
        <h2 className="text-xl font-semibold text-white">Mis Notificaciones</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li key={notification.id} className="p-4 hover:bg-gray-50">
            <Link to={`/notifications/${notification.id}`} className="flex items-start space-x-4">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {notification.message.length > 80 
                    ? `${notification.message.substring(0, 80)}...` 
                    : notification.message
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <div className="inline-flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;