import { Router } from 'express';
import prisma from '../prisma.mjs';

const router = Router();

// Helper function to fetch all portfolio data from the database
async function getPortfolioData() {
  const [heroData, skills, projects, socialLinks, articles] = await Promise.all([
    prisma.generalInfo.findFirst({ where: { id: 1 } }),
    prisma.skill.findMany({ orderBy: { id: 'asc' } }),
    prisma.project.findMany({ orderBy: { id: 'asc' } }),
    prisma.socialLink.findMany({ orderBy: { id: 'asc' } }),
    prisma.article.findMany({ orderBy: { id: 'asc' } }),
  ]);

  if (!heroData) {
      throw new Error("Portfolio data has not been seeded. Please run the database seed script.");
  }

  // The 'id' field from generalInfo is not needed on the frontend
  const { id, ...heroDataWithoutId } = heroData;

  return {
    heroData: heroDataWithoutId,
    skills,
    projects,
    socialLinks,
    articles,
  };
}

// GET /api/data
router.get('/', async (req, res) => {
  try {
    const data = await getPortfolioData();
    // Add cache-control headers to prevent browsers and edge networks from
    // serving stale data. This ensures updates are reflected immediately.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST /api/data
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { heroData, skills, projects, socialLinks, articles } = req.body;

    // Use a transaction to update all data atomically
    await prisma.$transaction([
      prisma.generalInfo.update({
        where: { id: 1 },
        data: heroData,
      }),
      prisma.skill.deleteMany(),
      prisma.skill.createMany({
        data: skills.map(({ name, level }) => ({ name, level })),
      }),
      prisma.project.deleteMany(),
      prisma.project.createMany({
        data: projects.map(({ title, description, imageUrl, tags, liveUrl, repoUrl }) => ({ title, description, imageUrl, tags, liveUrl, repoUrl })),
      }),
      prisma.socialLink.deleteMany(),
      prisma.socialLink.createMany({
        data: socialLinks.map(({ name, url, icon }) => ({ name, url, icon })),
      }),
      prisma.article.deleteMany(),
      prisma.article.createMany({
        data: articles.map(({ title, excerpt, date, url }) => ({ title, excerpt, date, url })),
      }),
    ]);
    
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
