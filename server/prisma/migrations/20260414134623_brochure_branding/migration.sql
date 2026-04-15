-- AlterTable
ALTER TABLE "AdminConfig" ADD COLUMN     "brochureName" TEXT DEFAULT 'SYSTEM LABS',
ADD COLUMN     "brochureTitle" TEXT DEFAULT 'Premium Software Solutions',
ADD COLUMN     "contactAddress" TEXT DEFAULT 'Silicon Valley, CA',
ADD COLUMN     "contactEmail" TEXT DEFAULT 'hello@systemlabs.dev',
ADD COLUMN     "contactPhone" TEXT DEFAULT '+1 (555) 000-0000';
