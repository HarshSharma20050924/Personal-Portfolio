import { Router } from 'express';
import prisma from '../prisma.mjs';

const router = Router();

const defaultData = {
  heroData: {
    name: 'Your Name',
    title: 'Your Title',
    description: 'Welcome to your portfolio! Use the admin panel to update this information.',
    profileImageUrl: '',
    email: 'your.email@example.com',
    phone: '',
    quote: 'Add a quote about yourself.'
  },
  skills: [],
  projects: [],
  socialLinks: [],
  articles: [],
  playgroundConfig: {
    heroTitle: "Playground Mode",
    heroSubtitle: "Experimenting with colors, shapes, and layouts.",
    bgType: "gradient",
    bgColor1: "#0f172a",
    bgColor2: "#1e293b",
    textColor: "#f8fafc",
    primaryColor: "#38bdf8",
    cardStyle: "glass",
    borderRadius: "rounded-2xl",
    showHero: true,
    showSkills: true,
    showProjects: true,
    showContact: true,
    animationSpeed: "normal",
    particleCount: 200,
    particleSpread: 10,
    particleBaseSize: 100,
    moveParticlesOnHover: true,
    disableRotation: false,
    particleSpeed: 0.1,
    flLineCount: 10,
    flLineDistance: 5.0,
    flBendRadius: 5.0,
    flBendStrength: -0.5,
    flParallax: true
  }
};

// GET /api/data
router.get('/', async (req, res) => {
  try {
    const [heroData, skills, projects, socialLinks, articles, playgroundConfig] = await Promise.all([
      prisma.generalInfo.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { id: 'asc' } }),
      prisma.project.findMany({ orderBy: { id: 'asc' } }),
      prisma.socialLink.findMany({ orderBy: { id: 'asc' } }),
      prisma.article.findMany({ orderBy: { id: 'asc' } }),
      prisma.playgroundConfig.findFirst({ where: { id: 1 } }),
    ]);

    let responseData;

    if (!heroData) {
      // If no heroData, this is likely a fresh deployment. Send defaults.
      responseData = defaultData;
    } else {
      const { id, ...heroDataWithoutId } = heroData;
      // Fix for playgroundConfig if it doesn't exist yet (migration handling)
      const safePlaygroundConfig = playgroundConfig || defaultData.playgroundConfig;
      const { id: pgId, ...playgroundConfigWithoutId } = safePlaygroundConfig;

      responseData = {
        heroData: heroDataWithoutId,
        skills,
        projects,
        socialLinks,
        articles,
        playgroundConfig: playgroundConfigWithoutId,
      };
    }
    
    // Add cache-control headers to prevent stale data.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.status(200).json(responseData);

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
    
    const { heroData, skills, projects, socialLinks, articles, playgroundConfig } = req.body;

    // Use a transaction to update all data atomically
    await prisma.$transaction([
      // Use upsert to create the record if it doesn't exist on the first save
      prisma.generalInfo.upsert({
        where: { id: 1 },
        update: heroData,
        create: { ...heroData, id: 1 }, // Ensure id is set on creation
      }),

      // Playground Config
      prisma.playgroundConfig.upsert({
        where: { id: 1 },
        update: playgroundConfig,
        create: { ...playgroundConfig, id: 1 },
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
