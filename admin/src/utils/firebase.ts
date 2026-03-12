import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// The Firebase Client SDK *must* be initialized with a web configuration object.
// The Service Account JSON is for the backend only and does not contain these IDs.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bybp-3f1aa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bybp-3f1aa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bybp-3f1aa.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const getFCMToken = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission denied");
      return null;
    }
    
    // Web Push certificates (VAPID key) is required by Firebase to generate a token in the browser.
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY"
    });
    return token;
  } catch (error) {
    console.error("FCM Token Error: ", error);
    return null;
  }
};

export const setupOnMessage = (callback: (payload: any) => void) => {
  if (!messaging) return;
  return onMessage(messaging, callback);
};
