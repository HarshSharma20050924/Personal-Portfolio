
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

// Helper function to format portfolio data as text
const formatPortfolioData = (heroData, skills, projects, socialLinks, articles) => {
    if (!heroData) return "No data available.";

    let content = `PORTFOLIO DATA EXPORT\nGenerated on: ${new Date().toISOString()}\n\n`;

    content += `=== PERSONAL INFORMATION ===\n`;
    content += `Name: ${heroData.name}\n`;
    content += `Title: ${heroData.title}\n`;
    content += `Email: ${heroData.email}\n`;
    content += `Phone: ${heroData.phone || 'N/A'}\n`;
    content += `Bio/Description: ${heroData.description}\n`;
    content += `Personal Quote: "${heroData.quote}"\n\n`;

    content += `=== SKILLS ===\n`;
    content += `My technical skills and proficiency levels are:\n`;
    skills.forEach(skill => {
      content += `- ${skill.name} (Proficiency: ${skill.level}%)\n`;
    });
    content += `\n`;

    content += `=== PROJECTS ===\n`;
    content += `Here are the projects I have worked on:\n`;
    projects.forEach(project => {
      content += `\nTitle: ${project.title}\n`;
      content += `Description: ${project.description}\n`;
      content += `Featured: ${project.featured ? 'Yes' : 'No'}\n`;
      content += `Techniques/Tags: ${project.tags.join(', ')}\n`;
      if (project.liveUrl) content += `Live Demo URL: ${project.liveUrl}\n`;
      if (project.repoUrl) content += `Source Code URL: ${project.repoUrl}\n`;
      if (project.videoUrl) content += `Video Showcase: ${project.videoUrl}\n`;
      if (project.huggingFaceUrl) content += `Hugging Face: ${project.huggingFaceUrl}\n`;
    });
    content += `\n`;

    content += `=== BLOG ARTICLES ===\n`;
    content += `Articles and insights I have written:\n`;
    articles.forEach(article => {
      content += `\nTitle: ${article.title}\n`;
      content += `Date: ${article.date}\n`;
      content += `Excerpt/Summary: ${article.excerpt}\n`;
      content += `Link: ${article.url}\n`;
    });
    content += `\n`;

    content += `=== SOCIAL LINKS ===\n`;
    socialLinks.forEach(link => {
      content += `- ${link.name}: ${link.url}\n`;
    });

    return content;
};

// GET /api/data/export - Export all data as formatted text for AI/RAG
router.get('/export', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [heroData, skills, projects, socialLinks, articles] = await Promise.all([
      prisma.generalInfo.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { id: 'asc' } }),
      prisma.project.findMany({ orderBy: { id: 'asc' } }),
      prisma.socialLink.findMany({ orderBy: { id: 'asc' } }),
      prisma.article.findMany({ orderBy: { id: 'asc' } }),
    ]);

    const content = formatPortfolioData(heroData, skills, projects, socialLinks, articles);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="portfolio_data.txt"');
    res.send(content);

  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

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
      responseData = defaultData;
    } else {
      const { id, ...heroDataWithoutId } = heroData;
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

    // 1. Save data to SQL Database (Prisma)
    await prisma.$transaction([
      prisma.generalInfo.upsert({
        where: { id: 1 },
        update: heroData,
        create: { ...heroData, id: 1 },
      }),

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
        data: projects.map(({ title, description, imageUrl, videoUrl, docUrl, tags, liveUrl, repoUrl, huggingFaceUrl, featured }) => ({ 
          title, description, imageUrl, videoUrl, docUrl, tags, liveUrl, repoUrl, huggingFaceUrl, featured 
        })),
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

    // 2. Trigger Auto-Update for AI Knowledge Base
    // We do this asynchronously (fire and forget) so we don't block the UI response.
    (async () => {
        try {
            const [hData, s, p, sl, a] = await Promise.all([
                prisma.generalInfo.findFirst({ where: { id: 1 } }),
                prisma.skill.findMany({ orderBy: { id: 'asc' } }),
                prisma.project.findMany({ orderBy: { id: 'asc' } }),
                prisma.socialLink.findMany({ orderBy: { id: 'asc' } }),
                prisma.article.findMany({ orderBy: { id: 'asc' } }),
            ]);
            
            const textContent = formatPortfolioData(hData, s, p, sl, a);
            
            // Send to Python RAG Service
            console.log("Triggering RAG knowledge update...");
            const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8000';
            const ragUrl = `${baseUrl}/api/rag/update-knowledge`;
            await fetch(ragUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: textContent,
                    source: 'portfolio_live' 
                })
            });
            console.log("RAG knowledge update triggered successfully.");
        } catch (ragError) {
            console.error("Failed to auto-update RAG service:", ragError.message);
            // Note: We don't fail the main request if RAG update fails, but we log it.
        }
    })();
    
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
