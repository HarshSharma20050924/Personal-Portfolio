import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './api/auth.mjs';
import dataRouter from './api/data.mjs';
import uploadRouter from './api/upload.mjs';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/upload', uploadRouter);


// --- Production Static Serving ---
if (process.env.NODE_ENV === 'production') {
  // Serve Admin Panel from /admin
  const adminBuildPath = path.join(__dirname, '../../admin/dist');
  app.use('/admin', express.static(adminBuildPath));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminBuildPath, 'index.html'));
  });

  // Serve Client Portfolio from root
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});