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
    update: {
      name: 'Harsh Sharma',
      title: 'Full-Stack Developer',
      description: 'I engineer performant and user-centric full-stack applications. My passion lies in delivering clean, maintainable code and exceptional user experiences.',
      profileImageUrl: '/uploads/default-avatar.png',
      email: 'hello@harshsharma.dev',
      phone: '+1 (123) 456-7890',
    },
    create: {
      id: 1,
      name: 'Harsh Sharma',
      title: 'Full-Stack Developer',
      description: 'I engineer performant and user-centric full-stack applications. My passion lies in delivering clean, maintainable code and exceptional user experiences.',
      profileImageUrl: '/uploads/default-avatar.png',
      email: 'hello@harshsharma.dev',
      phone: '+1 (123) 456-7890',
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
        imageUrl: '/uploads/default-project.png',
        tags: ['React', 'Node.js', 'API'],
        liveUrl: '#',
        repoUrl: '#',
      },
      {
        title: 'Project Two',
        description: 'Another fantastic project showcasing different skills.',
        imageUrl: '/uploads/default-project.png',
        tags: ['TypeScript', 'Vite', 'UI/UX'],
        liveUrl: '#',
        repoUrl: '#',
      }
    ]
  });

  // Clear and create social links
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { name: 'GitHub', url: '#', icon: 'github' },
      { name: 'LinkedIn', url: '#', icon: 'linkedin' },
      { name: 'Twitter', url: '#', icon: 'twitter' },
      { name: 'Instagram', url: '#', icon: 'instagram' },
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