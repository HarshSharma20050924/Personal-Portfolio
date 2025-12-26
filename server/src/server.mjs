import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './api/auth.mjs';
import dataRouter from './api/data.mjs';
import uploadRouter from './api/upload.mjs';
import chatRouter from './api/chat.mjs'; // Your RAG chat router
import prisma from './prisma.mjs';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Parse large JSON bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/chat', chatRouter); // Ensure RAG chat works

// --- Dynamic Sitemap ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    // Fetch projects from database
    const projects = await prisma.project.findMany({
      select: { id: true }
    });

    const staticUrls = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticUrls.forEach(({ url, changefreq, priority }) => {
      xml += `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    projects.forEach((project) => {
      xml += `
  <url>
    <loc>${baseUrl}/project/${project.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).end();
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
