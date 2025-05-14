// frontend/src/components/Notifications/NotificationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/api';

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await notificationService.getNotification(id);
        setNotification(response.data);
      } catch (err) {
        setError('Error al cargar la notificación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error || 'No se pudo encontrar la notificación'}/</span>
    </div>
    );
  }
}