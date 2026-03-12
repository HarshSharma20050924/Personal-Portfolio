
import { Router } from 'express';
import prisma from '../prisma.mjs';
import { sendNotification } from '../utils/firebase.mjs';

const router = Router();

// POST /api/messages/send (Public)
router.post('/send', async (req, res) => {
  try {
    const { name, email, message, service, company, phone, type } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, Email, and Message are required.' });
    }

    const messageType = type || (service ? 'freelance' : 'general');

    const newMessage = await prisma.message.create({
      data: { 
        name, 
        email, 
        message,
        type: messageType,
        service: service || null,
        company: company || null,
        phone: phone || null
      }
    });

    // Notify Admin via FCM
    try {
      const config = await prisma.adminConfig.findFirst();
      if (config?.fcmToken) {
        const title = messageType === 'freelance' ? 'New Freelance Lead!' : 'New Portfolio Message';
        const body = `From: ${name}\n"${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`;
        await sendNotification(config.fcmToken, title, body);
      }
    } catch (notifyError) {
      console.error('Notification Skip/Error:', notifyError);
      // Don't fail the message submission if notification fails
    }

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET /api/messages (Admin only)
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// DELETE /api/messages/:id (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.message.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(200).json({ message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message.' });
  }
});

export default router;
