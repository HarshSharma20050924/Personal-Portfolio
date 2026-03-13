
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './api/auth.mjs';
import dataRouter from './api/data.mjs';
import uploadRouter from './api/upload.mjs';
import messagesRouter from './api/messages.mjs'; // New Router
import ledgerRouter from './api/ledger.mjs';
import notificationsRouter from './api/notifications.mjs';
import prisma from './prisma.mjs';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middleware ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins for now to resolve the cross-deployment issue
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Additional CORS header safety for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/messages', messagesRouter); // Use new router
app.use('/api/ledger', ledgerRouter);
app.use('/api/notifications', notificationsRouter);

// --- Dynamic Sitemap ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const projects = await prisma.project.findMany({ select: { id: true } });

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
