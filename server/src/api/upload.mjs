import { Router } from 'express';
import multer from 'multer';

const router = Router();

// Configure multer to hold the file in memory instead of saving to disk
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Convert the image buffer to a Base64 string
    const base64Data = req.file.buffer.toString('base64');
    // Create a Data URI for embedding in the database and HTML
    const dataURI = `data:${req.file.mimetype};base64,${base64Data}`;

    // Return the Data URI. The frontend will save this to the database.
    res.status(200).json({ filePath: dataURI });
  } catch (error) {
    console.error('File Processing Error:', error);
    res.status(500).json({ message: 'Failed to process file.', error: error.message });
  }
});

export default router;
