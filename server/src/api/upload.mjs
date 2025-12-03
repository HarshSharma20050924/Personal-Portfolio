import { Router } from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';

const router = Router();

// Configure multer to hold the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const { originalname, buffer } = req.file;

    // Upload the file buffer to Vercel Blob
    const blob = await put(originalname, buffer, {
      access: 'public', // Make the file publicly accessible
    });

    // Return the public URL of the uploaded file.
    // The admin frontend is already set up to handle a URL here.
    res.status(200).json({ filePath: blob.url });
  } catch (error) {
    console.error('File Upload Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: `Failed to upload file to Vercel Blob. ${errorMessage}` });
  }
});

export default router;
