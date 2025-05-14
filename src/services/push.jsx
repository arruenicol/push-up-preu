// frontend/src/services/push.js

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from "firebase/app";

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
    
    // Add service worker registration options for Vercel environment
    const swOptions = {
      scope: '/'
    };
    
    // Register with explicit scope and check if it's already registered
    let registration;
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    // Check if we already have a service worker registered with the right scope
    const existingRegistration = registrations.find(reg => 
      reg.scope.includes(window.location.origin) && 
      (reg.active || reg.installing || reg.waiting)
    );
    
    if (existingRegistration) {
      console.log('Service Worker already registered:', existingRegistration);
      registration = existingRegistration;
      
      // Force update the service worker to ensure it's the latest version
      await existingRegistration.update();
    } else {
      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', swOptions);
      console.log('Service Worker registered successfully:', registration);
    }
    
    // Wait for the service worker to be active
    if (registration.installing) {
      console.log('Service Worker installing...');
      
      await new Promise((resolve) => {
        registration.installing.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') {
            console.log('Service Worker activated');
            resolve();
          }
        });
      });
    }
    
    // Make sure service worker is ready
    await navigator.serviceWorker.ready;
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
export const setupForegroundMessageHandler = () => {
  console.log('Setting up foreground message handler...');
  
  // Create a flag to track whether we've shown a notification
  let notificationDisplayed = false;
  
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Reset the flag for each new message
    notificationDisplayed = false;
    
    if (payload.notification) {
      const { title = 'New Notification', body = '' } = payload.notification;
      
      // Show a notification if permission is granted
      if (Notification.permission === 'granted') {
        // Use service worker to show notification
        navigator.serviceWorker.ready.then(registration => {
          if (!notificationDisplayed) {
            registration.showNotification(title, {
              body,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              data: payload.data,
              vibrate: [200, 100, 200]
            });
            notificationDisplayed = true;
          }
        });
      }
    }
  });
};

// Initialize push notifications
export const initializePushNotifications = async () => {
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
    setupForegroundMessageHandler();
    
    // We've removed the test notification code that was causing duplicates
    // The real notifications from Firebase will still work
    
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