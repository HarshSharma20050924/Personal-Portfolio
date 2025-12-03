// FIX: Changed import to handle potential CJS/ESM interop issues.
import prismaClient from '@prisma/client';
const { PrismaClient } = prismaClient;

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // in development.
  // FIX: Use `globalThis` instead of `global` for standard compliance, and bracket notation to avoid type errors.
  if (!globalThis['prisma']) {
    globalThis['prisma'] = new PrismaClient();
  }
  prisma = globalThis['prisma'];
}

export default prisma;
