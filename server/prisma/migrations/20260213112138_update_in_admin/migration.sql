-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "showInFreelance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "showInFreelance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "showInFreelance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SocialLink" ADD COLUMN     "showInFreelance" BOOLEAN NOT NULL DEFAULT false;
