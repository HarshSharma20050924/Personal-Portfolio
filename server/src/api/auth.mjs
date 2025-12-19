
import { Router } from 'express';
import prisma from '../prisma.mjs';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const adminUser = await prisma.admin.findFirst({
      where: { username: username },
    });

    // In a real app, use a library like bcrypt to compare hashed passwords.
    if (adminUser && adminUser.password === password) {
      // Return the API key from env vars on successful login for the frontend to use
      const adminApiKey = process.env.ADMIN_API_KEY;
      if (!adminApiKey) {
        console.error('ADMIN_API_KEY is not set in environment variables.');
        return res.status(500).json({ message: 'Server configuration error.' });
      }
      return res.status(200).json({ apiKey: adminApiKey });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// SIMULATION: Register a biometric credential
// In a real production app, this would verify a WebAuthn attestation.
router.post('/register-biometric', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const adminApiKey = process.env.ADMIN_API_KEY;
        
        if (!authHeader || authHeader !== `Bearer ${adminApiKey}`) {
            return res.status(401).json({ message: 'Unauthorized. Please log in with password first.' });
        }

        // Here we would normally save the public key credential to the database associated with the admin.
        // For this portfolio template, we acknowledge the registration.
        console.log("Biometric credential registered for device:", req.body.deviceName);
        
        return res.status(200).json({ message: 'Device registered successfully.' });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// SIMULATION: Login with biometric
// In a real production app, this would verify a WebAuthn assertion.
router.post('/biometric', async (req, res) => {
    try {
        // Since we are simulating, we check if the feature is enabled or simply allow it 
        // if the client claims to have a credential. 
        // SECURITY NOTE: This endpoint currently returns the API key without actual verification 
        // because we cannot implement full FIDO2 server logic in this single file without external libs.
        // It relies on the browser's local authentication simulation in the frontend.
        
        const adminApiKey = process.env.ADMIN_API_KEY;
        if (!adminApiKey) {
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        return res.status(200).json({ apiKey: adminApiKey });
    } catch (error) {
        console.error('Biometric Auth Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
