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

export default router;
