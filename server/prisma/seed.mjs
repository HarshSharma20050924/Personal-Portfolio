// FIX: Import `process` from `node:process` to get correct types for `process.exit` and resolve module errors.
import process from 'node:process';

// FIX: Changed import to handle potential CJS/ESM interop issues.
import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Using a self-contained placeholder image ensures the portfolio works
  // offline and without any external network requests for initial data.
  const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARwAAACxCAMAAAAh3/JWAAAAA1BMVEXm5+RbO+oCAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=';

  // Create Admin User if it doesn't exist. Does not overwrite existing data.
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password', // IMPORTANT: Use a strong, hashed password in a real app!
    },
  });

  // Create General Info (Hero Section) if it doesn't exist. Does not overwrite existing data.
  await prisma.generalInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Harsh Sharma',
      title: 'Full-Stack Developer',
      description: 'I engineer performant and user-centric full-stack applications. My passion lies in delivering clean, maintainable code and exceptional user experiences.',
      quote: 'Simplicity is the ultimate sophistication.',
      profileImageUrl: placeholderImage,
      email: 'hello@harshsharma.dev',
      phone: '+1 (123) 456-7890',
      resumeUrl: '#',
      template: 'default',
    },
  });
  
  // Seed Playground Config
  await prisma.playgroundConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
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
  });
  
  // Seed skills only if the table is empty to prevent overwriting user data
  if ((await prisma.skill.count()) === 0) {
    console.log('Seeding skills...');
    await prisma.skill.createMany({
      data: [
          { name: 'React', level: 90 },
          { name: 'Node.js', level: 85 },
          { name: 'Prisma', level: 80 },
          { name: 'Tailwind CSS', level: 95 },
          { name: 'TypeScript', level: 88 },
          { name: 'PostgreSQL', level: 75 },
          { name: 'Docker', level: 70 },
          { name: 'Express.js', level: 82 },
      ],
      skipDuplicates: true,
    });
  } else {
    console.log('Skills table already contains data, skipping seed.');
  }

  // Seed projects only if the table is empty
  if ((await prisma.project.count()) === 0) {
    console.log('Seeding projects...');
    await prisma.project.createMany({
      data: [
        {
          title: 'Project One',
          description: 'A brief description of this amazing project.',
          imageUrl: placeholderImage,
          tags: ['React', 'Node.js', 'API'],
          liveUrl: '#',
          repoUrl: '#',
        },
        {
          title: 'Project Two',
          description: 'Another fantastic project showcasing different skills.',
          imageUrl: placeholderImage,
          tags: ['TypeScript', 'Vite', 'UI/UX'],
          liveUrl: '#',
          repoUrl: '#',
        }
      ]
    });
  } else {
    console.log('Projects table already contains data, skipping seed.');
  }

  // Seed social links only if the table is empty
  if ((await prisma.socialLink.count()) === 0) {
    console.log('Seeding social links...');
    await prisma.socialLink.createMany({
      data: [
        { name: 'GitHub', url: '#', icon: 'github' },
        { name: 'LinkedIn', url: '#', icon: 'linkedin' },
        { name: 'Twitter', url: '#', icon: 'twitter' },
        { name: 'Instagram', url: '#', icon: 'instagram' },
      ]
    });
  } else {
    console.log('Social links table already contains data, skipping seed.');
  }

  // Seed articles only if the table is empty
  if ((await prisma.article.count()) === 0) {
    console.log('Seeding articles...');
    await prisma.article.createMany({
      data: [
          {
              title: "The Rise of Serverless Architecture",
              excerpt: "Exploring the benefits and trade-offs of serverless computing in modern web development.",
              date: "October 24, 2023",
              url: "#",
          },
          {
              title: "A Deep Dive into React Hooks",
              excerpt: "Understanding how React Hooks can simplify your components and state management.",
              date: "September 15, 2023",
              url: "#",
          }
      ]
    });
  } else {
    console.log('Articles table already contains data, skipping seed.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
