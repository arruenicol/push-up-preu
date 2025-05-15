// frontend/src/services/notificationStorage.js
/**
 * Service to manage notification storage in localStorage
 */

const STORAGE_KEY = 'app_notifications';

/**
 * Get all stored notifications
 * @returns {Array} Array of notification objects
 */
export const getStoredNotifications = () => {
  try {
    const storedNotifications = localStorage.getItem(STORAGE_KEY);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Error getting stored notifications:', error);
    return [];
  }
};

/**
 * Save a notification to localStorage
 * @param {Object} notification - The notification to save
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional notification data (optional)
 * @param {number} notification.timestamp - Timestamp of when notification was received
 * @returns {Array} Updated array of notifications
 */
export const saveNotification = (notification) => {
  try {
    // Ensure the notification has required fields
    if (!notification.title) {
      console.warn('Attempted to save notification without required fields');
      return getStoredNotifications();
    }

    // Add timestamp if not provided
    const notificationToSave = {
      ...notification,
      timestamp: notification.timestamp || Date.now(),
      read: notification.read || false,
      id: notification.id || `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Get existing notifications
    const notifications = getStoredNotifications();
    
    // Add new notification at the beginning of the array (newest first)
    const updatedNotifications = [notificationToSave, ...notifications];
    
    // Limit to 50 notifications to prevent localStorage from getting too large
    const limitedNotifications = updatedNotifications.slice(0, 50);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedNotifications));
    
    return limitedNotifications;
  } catch (error) {
    console.error('Error saving notification:', error);
    return getStoredNotifications();
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Array} Updated array of notifications
 */
export const markNotificationAsRead = (notificationId) => {
  try {
    const notifications = getStoredNotifications();
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    
    return updatedNotifications;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return getStoredNotifications();
  }
};

/**
 * Mark all notifications as read
 * @returns {Array} Updated array of notifications
 */
export const markAllNotificationsAsRead = () => {
  try {
    const notifications = getStoredNotifications();
    
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    
    return updatedNotifications;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return getStoredNotifications();
  }
};

/**
 * Delete a notification by ID
 * @param {string} notificationId - ID of the notification to delete
 * @returns {Array} Updated array of notifications
 */
export const deleteNotification = (notificationId) => {
  try {
    const notifications = getStoredNotifications();
    
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
    
    return updatedNotifications;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return getStoredNotifications();
  }
};

/**
 * Clear all notifications from storage
 * @returns {Array} Empty array
 */
export const clearAllNotifications = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return getStoredNotifications();
  }
};