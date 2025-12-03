-- DropIndex
DROP INDEX "Skill_name_key";

-- AlterTable
ALTER TABLE "GeneralInfo" ADD COLUMN     "template" TEXT DEFAULT 'default',
ALTER COLUMN "profileImageUrl" DROP NOT NULL;
