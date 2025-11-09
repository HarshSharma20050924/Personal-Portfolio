import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Admin User
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password', // IMPORTANT: Use a strong, hashed password in a real app!
    },
  });

  // Create General Info (Hero Section)
  await prisma.generalInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Your Name Here',
      title: 'Full-Stack Developer',
      description: 'I build beautiful and functional web applications. Passionate about clean code and great user experiences.',
    },
  });
  
  // Clear and create skills
  await prisma.skill.deleteMany();
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

  // Clear and create projects
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: 'Project One',
        description: 'A brief description of this amazing project.',
        imageUrl: 'https://picsum.photos/seed/project1/500/300',
        tags: ['React', 'Node.js', 'API'],
        liveUrl: '#',
        repoUrl: '#',
      },
      {
        title: 'Project Two',
        description: 'Another fantastic project showcasing different skills.',
        imageUrl: 'https://picsum.photos/seed/project2/500/300',
        tags: ['TypeScript', 'Vite', 'UI/UX'],
        liveUrl: '#',
        repoUrl: '#',
      }
    ]
  });

  // Clear and create articles
  await prisma.article.deleteMany();
  await prisma.article.createMany({
    data: [
      {
        title: 'Understanding React Hooks',
        excerpt: 'A deep dive into the most common hooks in React and how to use them effectively.',
        date: 'October 26, 2023',
        url: '#',
      },
      {
        title: 'Modern CSS Layouts',
        excerpt: 'Exploring the power of Flexbox and Grid for creating responsive designs.',
        date: 'September 15, 2023',
        url: '#',
      },
    ]
  });

  // Clear and create social links
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { name: 'GitHub', url: '#', icon: 'github' },
      { name: 'LinkedIn', url: '#', icon: 'linkedin' },
      { name: 'Twitter', url: '#', icon: 'twitter' },
    ]
  });

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
