
import { Router } from 'express';
import prisma from '../prisma.mjs';
import crypto from 'crypto';

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

    if (adminUser && adminUser.password === password) {
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

// Register a biometric credential
router.post('/register-biometric', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const adminApiKey = process.env.ADMIN_API_KEY;
        
        if (!authHeader || authHeader !== `Bearer ${adminApiKey}`) {
            return res.status(401).json({ message: 'Unauthorized. Please log in with password first.' });
        }

        // Generate a unique token for this device
        const credentialId = crypto.randomUUID();
        const deviceName = req.body.deviceName || 'Unknown Device';

        await prisma.biometricCredential.create({
            data: {
                credentialId,
                deviceName
            }
        });
        
        console.log(`Registered device: ${deviceName} with ID: ${credentialId}`);
        
        // Return the token to the client to be stored in localStorage
        return res.status(200).json({ 
            message: 'Device registered successfully.',
            credentialId: credentialId 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login with biometric
router.post('/biometric', async (req, res) => {
    try {
        const { credentialId } = req.body;

        if (!credentialId) {
            return res.status(400).json({ message: 'No credential provided. Please register this device first.' });
        }

        // Verify if this credential ID exists in our database
        const credential = await prisma.biometricCredential.findUnique({
            where: { credentialId }
        });

        if (!credential) {
            return res.status(401).json({ message: 'Device not recognized. Access denied.' });
        }
        
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
