// Database Schema Sync Trigger
import { Router } from "express";
import prisma from "../prisma.mjs";

const router = Router();

const defaultData = {
  heroData: {
    name: "Your Name",
    title: "Your Title",
    description:
      "Welcome to your portfolio! Use the admin panel to update this information.",
    profileImageUrl: "",
    email: "your.email@example.com",
    phone: "",
    quote: "Add a quote about yourself.",
  },
  skills: [],
  projects: [],
  socialLinks: [],
  articles: [],
  experience: [],
  education: [],
  services: [],
  testimonials: [],
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
  },
};

/* ---------- GET /api/data ---------- */
router.get("/", async (req, res) => {
  try {
    const [
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      services,
      playgroundConfig,
      testimonials,
      adminConfig,
    ] = await Promise.all([
      prisma.generalInfo.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { id: "asc" } }),
      prisma.project.findMany({ orderBy: { id: "asc" }, include: { media: true } }),
      prisma.socialLink.findMany({ orderBy: { id: "asc" } }),
      prisma.article.findMany({ orderBy: { id: "asc" } }),
      prisma.experience.findMany({ orderBy: { id: "desc" } }),
      prisma.education.findMany({ orderBy: { id: "desc" } }),
      prisma.service.findMany({
        orderBy: { id: "asc" },
        include: { projects: { include: { media: true } } },
      }),
      prisma.playgroundConfig.findFirst({ where: { id: 1 } }),
      prisma.testimonial.findMany({ orderBy: { id: "asc" } }),
      prisma.adminConfig.findFirst({ where: { id: 1 } }),
    ]);

    let responseData;

    if (!heroData) {
      responseData = defaultData;
    } else {
      const { id: _heroId, ...heroDataWithoutId } = heroData;

      const safePlaygroundConfig =
        playgroundConfig || defaultData.playgroundConfig;
      const { id: _pgId, ...playgroundConfigWithoutId } = safePlaygroundConfig;

      responseData = {
        heroData: heroDataWithoutId,
        skills,
        projects,
        socialLinks,
        articles,
        experience,
        education,
        services,
        testimonials,
        adminConfig,
        playgroundConfig: playgroundConfigWithoutId,
      };
    }

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.status(200).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error?.message });
  }
});

/* ---------- GET /api/data/testimonials ---------- */
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { id: "asc" } });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error?.message });
  }
});

/* ---------- POST /api/data ---------- */
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      services,
      playgroundConfig,
      testimonials,
    } = req.body ?? {};

    await prisma.$transaction(async (tx) => {
      // 1. Update Singletons
      await tx.generalInfo.upsert({
        where: { id: 1 },
        update: heroData,
        create: { ...heroData, id: 1 },
      });

      await tx.playgroundConfig.upsert({
        where: { id: 1 },
        update: playgroundConfig,
        create: { ...playgroundConfig, id: 1 },
      });

      // 2. Clear Tables (Order matters for Foreign Keys)
      // Delete projects first because they might reference services
      await tx.project.deleteMany(); 
      await tx.service.deleteMany();
      await tx.skill.deleteMany();
      await tx.socialLink.deleteMany();
      await tx.article.deleteMany();
      await tx.experience.deleteMany();
      await tx.education.deleteMany();
      await tx.testimonial.deleteMany();

      // 3. Recreate Services and Map IDs
      const serviceIdMap = new Map();
      if (Array.isArray(services) && services.length > 0) {
        for (const service of services) {
          const { id: oldId, projects: _p, ...rest } = service;
          // Filter out IDs or other fields that might be null/invalid
          if (!rest.title) continue;
          // Create one by one to get the new ID
          const newService = await tx.service.create({ data: rest });
          if (oldId) {
            serviceIdMap.set(oldId, newService.id);
          }
        }
      }

      // 4. Recreate Projects using Mapped Service IDs
      if (Array.isArray(projects) && projects.length > 0) {
        for (const project of projects) {
          const { id, service, serviceId, serviceIds, media, ...rest } = project;
          // Resolve correct service ID for backwards compatibility
          const incomingServiceId = service?.id || serviceId;
          const mappedServiceId = serviceIdMap.get(incomingServiceId) || null;
          
          // Resolve multiple service IDs
          const incomingServiceIds = Array.isArray(serviceIds) ? serviceIds : (incomingServiceId ? [incomingServiceId] : []);
          const mappedServiceIds = incomingServiceIds
            .map(sid => serviceIdMap.get(sid))
            .filter(sid => sid !== undefined && sid !== null);

          // Clean up rest to ensure no invalid fields are passed to Prisma
          // Specifically remove relation fields that might have leaked in
          delete rest.media;
          delete rest.service;

          await tx.project.create({
            data: {
              ...rest,
              serviceId: mappedServiceId,
              serviceIds: mappedServiceIds,
              media: {
                create: (Array.isArray(media) ? media : [])
                  .filter(m => m.url && m.url.trim() !== "") // Skip empty media
                  .map(({ id, projectId, ...mRest }) => mRest)
              }
            }
          });
        }
      }

      // 5. Recreate other simple lists
      if (Array.isArray(skills) && skills.length > 0) {
        await tx.skill.createMany({ data: skills.map(({ id, ...rest }) => rest) });
      }
      if (Array.isArray(socialLinks) && socialLinks.length > 0) {
        await tx.socialLink.createMany({ data: socialLinks.map(({ id, ...rest }) => rest) });
      }
      if (Array.isArray(articles) && articles.length > 0) {
        await tx.article.createMany({ data: articles.map(({ id, ...rest }) => rest) });
      }
      if (Array.isArray(experience) && experience.length > 0) {
        await tx.experience.createMany({ data: experience.map(({ id, ...rest }) => rest) });
      }
      if (Array.isArray(education) && education.length > 0) {
        await tx.education.createMany({ data: education.map(({ id, ...rest }) => rest) });
      }
      if (Array.isArray(testimonials) && testimonials.length > 0) {
        await tx.testimonial.createMany({ data: testimonials.map(({ id, ...rest }) => rest) });
      }
    });

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Save Data Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error?.message });
  }
});

/* ---------- GET /api/data/export ---------- */
router.get("/export", async (req, res) => {
  try {
    const [
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      services,
      playgroundConfig,
      testimonials,
      adminConfig,
    ] = await Promise.all([
      prisma.generalInfo.findFirst({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { id: "asc" } }),
      prisma.project.findMany({ orderBy: { id: "asc" }, include: { media: true } }),
      prisma.socialLink.findMany({ orderBy: { id: "asc" } }),
      prisma.article.findMany({ orderBy: { id: "asc" } }),
      prisma.experience.findMany({ orderBy: { id: "desc" } }),
      prisma.education.findMany({ orderBy: { id: "desc" } }),
      prisma.service.findMany({
        orderBy: { id: "asc" },
        include: { projects: { include: { media: true } } },
      }),
      prisma.playgroundConfig.findFirst({ where: { id: 1 } }),
      prisma.testimonial.findMany({ orderBy: { id: "asc" } }),
      prisma.adminConfig.findFirst({ where: { id: 1 } }),
    ]);

    res.json({
      heroData,
      skills,
      projects,
      socialLinks,
      articles,
      experience,
      education,
      services,
      testimonials,
      playgroundConfig,
      adminConfig,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e?.message });
  }
});

/* ---------- POST /api/data/config ---------- */
router.post("/config", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, ...configData } = req.body;
    await prisma.adminConfig.upsert({
      where: { id: 1 },
      update: configData,
      create: { ...configData, id: 1 },
    });

    res.status(200).json({ message: "Config saved successfully" });
  } catch (error) {
    console.error("Config Save Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error?.message });
  }
});

export default router;
