import admin from 'firebase-admin';

try {
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    try {
      if (typeof serviceAccount === 'string') {
        let cleaned = serviceAccount.trim();
        console.error("DEBUG: Initial string length:", cleaned.length);
        console.error("DEBUG: Starts with:", cleaned.substring(0, 20));
        
        // Robustly remove wrapping quotes
        if (cleaned.startsWith("'") || cleaned.startsWith('"')) {
          cleaned = cleaned.slice(1);
        }
        if (cleaned.endsWith("'") || cleaned.endsWith('"')) {
          cleaned = cleaned.slice(0, -1);
        }
        cleaned = cleaned.trim();

        if (cleaned.startsWith('{')) {
          try {
            serviceAccount = JSON.parse(cleaned);
            process.stderr.write("DEBUG: Successfully parsed JSON string.\n");
          } catch (e) {
            console.error("DEBUG: JSON Parse Error:", e.message);
          }
        }
      }
      
      if (typeof serviceAccount === 'object' && serviceAccount !== null) {
        // Fix for common newline escaping issues in private_key
        if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
          if (serviceAccount.private_key.includes('\\n')) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            process.stderr.write("DEBUG: Fixed newlines in private_key.\n");
          }
        }
        process.stderr.write(`DEBUG: serviceAccount is object. Keys: ${Object.keys(serviceAccount)}\n`);
      } else {
        process.stderr.write(`DEBUG: serviceAccount is string or null. Starts with: ${String(serviceAccount).substring(0, 20)}\n`);
      }

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      }
    } catch (error) {
       console.error("Firebase cert() initialization error:", error);
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
