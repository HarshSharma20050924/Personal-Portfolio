-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "showInClient" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "showInClient" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "showInClient" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "showInClient" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SocialLink" ADD COLUMN     "showInClient" BOOLEAN NOT NULL DEFAULT true;
