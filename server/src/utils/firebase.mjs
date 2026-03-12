import admin from 'firebase-admin';

try {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    // Vercel/Docker sometimes double-quotes JSON strings. Handle it gracefully.
    while (typeof serviceAccount === 'string' && (serviceAccount.startsWith('{') || serviceAccount.startsWith('"'))) {
      try {
        const parsed = JSON.parse(serviceAccount);
        if (typeof parsed === 'string' && parsed === serviceAccount) break; // Avoid infinite loop if string is not valid JSON
        serviceAccount = parsed;
      } catch (e) {
        break; // If parse fails, keep current value
      }
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
