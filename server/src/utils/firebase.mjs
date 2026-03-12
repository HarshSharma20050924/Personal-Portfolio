import admin from 'firebase-admin';

try {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    if (typeof serviceAccount === 'string') {
      serviceAccount = JSON.parse(serviceAccount);
    }
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT is not set in environment variables.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

export const sendNotification = async (token, title, body) => {
  if (!admin.apps.length) {
    console.error("Firebase Admin not initialized. Cannot send notification.");
    return null;
  }
  
  try {
    const message = {
      notification: { title, body },
      token
    };
    await admin.messaging().send(message);
    console.log('Firebase notification sent successfully.');
  } catch (error) {
    console.error('Firebase messaging error:', error);
    throw error;
  }
};
