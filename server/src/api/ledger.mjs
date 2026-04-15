
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
    const { clientName, project, totalAmount, paidAmount, notes, status, emiDetails } = req.body;
    
    // Generate Invoice Number if not provided
    const count = await prisma.clientLedger.count();
    const year = new Date().getFullYear();
    const invoiceNumber = `SL/${year}/${count + 1}`;
    
    const remainingAmount = (totalAmount || 0) - (paidAmount || 0);

    const entry = await prisma.clientLedger.create({
      data: { 
        clientName, 
        project, 
        totalAmount: totalAmount || 0, 
        paidAmount: paidAmount || 0, 
        remainingAmount,
        notes, 
        status,
        invoiceNumber,
        emiDetails: emiDetails ? JSON.stringify(emiDetails) : null
      }
    });
    res.status(201).json(entry);
  } catch (error) {
    console.error('Ledger POST Error:', error);
    res.status(500).json({ message: 'Failed to create entry' });
  }
});

// PATCH /api/ledger/:id
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If amounts are changing, recalculate remaining
    if (updateData.totalAmount !== undefined || updateData.paidAmount !== undefined) {
        const existing = await prisma.clientLedger.findUnique({ where: { id: parseInt(id) } });
        const total = updateData.totalAmount !== undefined ? updateData.totalAmount : existing.totalAmount;
        const paid = updateData.paidAmount !== undefined ? updateData.paidAmount : existing.paidAmount;
        updateData.remainingAmount = total - paid;
    }

    if (updateData.emiDetails && typeof updateData.emiDetails === 'object') {
        updateData.emiDetails = JSON.stringify(updateData.emiDetails);
    }

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
