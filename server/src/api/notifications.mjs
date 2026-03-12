
import { Router } from 'express';
import prisma from '../prisma.mjs';

const router = Router();

// Middleware for admin auth
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// GET /api/notifications/token
router.get('/token', adminAuth, async (req, res) => {
  try {
    const config = await prisma.adminConfig.findFirst();
    res.json({ token: config?.fcmToken || null });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch token' });
  }
});

// POST /api/notifications/token
router.post('/token', adminAuth, async (req, res) => {
  try {
    const { token } = req.body;
    const config = await prisma.adminConfig.findFirst();
    
    if (config) {
      await prisma.adminConfig.update({
        where: { id: config.id },
        data: { fcmToken: token }
      });
    } else {
      await prisma.adminConfig.create({
        data: { fcmToken: token }
      });
    }
    
    res.json({ message: 'Token updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update token' });
  }
});

export default router;
