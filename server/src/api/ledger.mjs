
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

// GET /api/ledger
router.get('/', adminAuth, async (req, res) => {
  try {
    const entries = await prisma.clientLedger.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ledger' });
  }
});

// POST /api/ledger
router.post('/', adminAuth, async (req, res) => {
  try {
    const { clientName, project, totalAmount, paidAmount, notes, status } = req.body;
    const entry = await prisma.clientLedger.create({
      data: { clientName, project, totalAmount, paidAmount, notes, status }
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create entry' });
  }
});

// PATCH /api/ledger/:id
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const entry = await prisma.clientLedger.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

// DELETE /api/ledger/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.clientLedger.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});

export default router;
