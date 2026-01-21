
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
  experience: [],
  education: [],
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

/* ---------- EXPORT FORMATTER ---------- */
const formatPortfolioData = (
  heroData,
  skills,
  projects,
  socialLinks,
  articles,
  experience,
  education
) => {
  if (!heroData) return 'No data available.';

  let content = `PORTFOLIO KNOWLEDGE BASE\n\n`;

  content += `=== PERSONAL INFORMATION ===\n`;
  content += `Name: ${heroData.name}\n`;
  content += `Title: ${heroData.title}\n`;
  content += `Email: ${heroData.email}\n`;
  content += `Phone: ${heroData.phone || 'N/A'}\n`;
  content += `Bio/Description: ${heroData.description}\n`;
  content += `Quote: "${heroData.quote}"\n\n`;

  content += `=== SKILLS ===\n`;
  skills.forEach(s => {
    content += `- ${s.name} (Proficiency: ${s.level}%)\n`;
  });
  content += `\n`;

  content += `=== PROJECTS ===\n`;
  projects.forEach(p => {
    content += `\nProject: ${p.title}\n`;
    content += `Description: ${p.description}\n`;
    content += `Tech Stack: ${p.tags.join(', ')}\n`;
    if (p.challenge) content += `Challenge: ${p.challenge}\n`;
    if (p.outcome) content += `Outcome: ${p.outcome}\n`;
    if (p.liveUrl) content += `Live URL: ${p.liveUrl}\n`;
    if (p.repoUrl) content += `Repo URL: ${p.repoUrl}\n`;
  });
  content += `\n`;

  content += `=== EXPERIENCE ===\n`;
  experience.forEach(e => {
    content += `\nPosition: ${e.position}\n`;
    content += `Company: ${e.company}\n`;
    content += `Period: ${e.period}\n`;
    content += `Description: ${e.description}\n`;
  });
  content += `\n`;

  content += `=== EDUCATION ===\n`;
  education.forEach(e => {
    content += `\nDegree: ${e.degree}\n`;
    content += `Institution: ${e.institution}\n`;
    content += `Period: ${e.period}\n`;
  });
  content += `\n`;

  content += `=== ARTICLES ===\n`;
  articles.forEach(a => {
    content += `\nArticle Title: ${a.title}\n`;
    content += `Date: ${a.date}\n`;
    content += `Excerpt: ${a.excerpt}\n`;
  });
  content += `\n`;

  content += `=== SOCIAL LINKS ===\n`;
  socialLinks.forEach(l => {
    content += `- ${l.name}: ${l.url}\n`;
  });

  return content;
};

// ... export route (omitted for brevity, assume unchanged) ...

/* ---------- GET /api/data ---------- */
router.get('/', async (req, res) => {
  try {
    const [
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      playgroundConfig
    ] = await Promise.all([
      prisma.generalInfo.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { id: 'asc' } }),
      prisma.project.findMany({ orderBy: { id: 'asc' } }),
      prisma.socialLink.findMany({ orderBy: { id: 'asc' } }),
      prisma.article.findMany({ orderBy: { id: 'asc' } }),
      prisma.experience.findMany({ orderBy: { id: 'desc' } }),
      prisma.education.findMany({ orderBy: { id: 'desc' } }),
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
        experience,
        education,
        playgroundConfig: playgroundConfigWithoutId,
      };
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

/* ---------- POST /api/data ---------- */
router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      playgroundConfig
    } = req.body;

    // 1. Update PostgreSQL (Persistent Storage)
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
        data: projects,
      }),
      prisma.socialLink.deleteMany(),
      prisma.socialLink.createMany({
        data: socialLinks,
      }),
      prisma.article.deleteMany(),
      prisma.article.createMany({
        data: articles,
      }),
      prisma.experience.deleteMany(),
      prisma.experience.createMany({
        data: experience,
      }),
      prisma.education.deleteMany(),
      prisma.education.createMany({
        data: education,
      }),
    ]);

    // 2. Sync with RAG Service (Knowledge Base)
    // We strictly filter data here. We do NOT fetch or send 'messages' (inbox).
    const knowledgeText = formatPortfolioData(
        heroData,
        skills,
        projects,
        socialLinks,
        articles,
        experience,
        education
    );

    // Call Python RAG Service to update in-memory vector DB
    try {
        await fetch('http://localhost:8000/update-knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: knowledgeText })
        });
        console.log("RAG Knowledge Base updated successfully.");
    } catch (ragError) {
        console.error("Failed to update RAG Knowledge Base:", ragError);
        // We don't fail the whole request if RAG fails, but we log it.
    }

    res.status(200).json({ message: 'Data saved successfully and Knowledge Base updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
