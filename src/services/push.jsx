// frontend/src/services/push.js
/**
 * Servicio para gestionar notificaciones push
 */

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from "firebase/app";
import { saveNotification } from './notificationStorage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCyqBjC9dvkLY3YPUHKghN8pQjkuv4wA4",
  authDomain: "preu-uc.firebaseapp.com",
  projectId: "preu-uc",
  storageBucket: "preu-uc.firebasestorage.app",
  messagingSenderId: "993588240382",
  appId: "1:993588240382:web:ceb077d477bd2a27572aaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Check if push notifications are supported by the browser
export const isPushSupported = () => {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;
  console.log('Push notifications supported:', supported);
  return supported;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushSupported()) {
    console.warn('Push notifications are not supported in this browser');
    return false;
  }
  
  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Register the service worker
export const registerServiceWorker = async () => {
  if (!isPushSupported()) {
    console.warn('Service Worker is not supported in this browser');
    return null;
  }
  
  try {
    console.log('Registering service worker...');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('Service Worker registered successfully:', registration);
    
    // Set up a message listener to receive notifications from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received message from service worker:', event.data);
      
      // If the message contains notification data, save it to storage
      if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
        const notification = event.data.notification;
        saveNotification(notification);
        
        // Dispatch a custom event that the app can listen for
        window.dispatchEvent(new CustomEvent('notificationReceived', { 
          detail: notification 
        }));
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Error registering Service Worker:', error);
    return null;
  }
};

// Get the Firebase Cloud Messaging token
export const getFirebaseToken = async (serviceWorkerRegistration) => {
  try {
    console.log('Getting FCM token...');
    
    const currentToken = await getToken(messaging, {
      vapidKey: 'BMjSp1aqOCW-YZeAX26KmuleGo5C402xSbMWsf5yaLYpUOM83tfCkCStyCZkkOdGDHkWTPVB55-ZshWzTjOrMmk',
      serviceWorkerRegistration
    });

    if (currentToken) {
      console.log('FCM token obtained:', currentToken);
      return currentToken;
    } else {
      console.warn('No FCM token available. Permission might be denied.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving FCM token:', error);
    return null;
  }
};

// Setup foreground message handling
export const setupForegroundMessageHandler = (onNotificationReceived) => {
  console.log('Setting up foreground message handler...');
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      // Create notification object
      const notificationData = {
        title,
        body,
        data: payload.data || {},
        timestamp: Date.now(),
        read: false,
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Save notification to localStorage
      const updatedNotifications = saveNotification(notificationData);
      
      // Call the callback if provided
      if (typeof onNotificationReceived === 'function') {
        onNotificationReceived(updatedNotifications);
      }
      
      // Dispatch a custom event
      window.dispatchEvent(new CustomEvent('notificationReceived', { 
        detail: notificationData 
      }));
      
      // Show a notification if permission is granted
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/favicon.ico',
            data: {
              ...payload.data,
              id: notificationData.id // Include the ID in the notification data
            }
          });
        });
      }
    }
  });
};

// Initialize push notifications
export const initializePushNotifications = async (onNotificationReceived) => {
  console.log('Initializing push notifications...');
  
  if (!isPushSupported()) {
    return {
      success: false,
      message: 'Push notifications are not supported in this browser'
    };
  }
  
  try {
    // Request notification permission first
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return {
        success: false,
        message: 'Notification permission denied'
      };
    }
    
    // Register service worker
    const serviceWorkerReg = await registerServiceWorker();
    if (!serviceWorkerReg) {
      return {
        success: false,
        message: 'Failed to register Service Worker'
      };
    }
    
    // Get FCM token
    const fcmToken = await getFirebaseToken(serviceWorkerReg);
    if (!fcmToken) {
      return {
        success: false,
        message: 'Failed to obtain FCM token'
      };
    }
    
    // Setup foreground message handling
    setupForegroundMessageHandler(onNotificationReceived);
    
    // Return success with token and service worker registration
    return {
      success: true,
      token: fcmToken,
      serviceWorkerReg
    };
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return {
      success: false,
      message: error.message
    };
  }
};