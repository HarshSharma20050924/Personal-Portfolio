-- AlterTable
ALTER TABLE "GeneralInfo" ALTER COLUMN "template" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlaygroundConfig" ALTER COLUMN "heroTitle" DROP NOT NULL,
ALTER COLUMN "heroTitle" DROP DEFAULT,
ALTER COLUMN "heroSubtitle" DROP NOT NULL,
ALTER COLUMN "heroSubtitle" DROP DEFAULT,
ALTER COLUMN "bgType" SET DEFAULT 'solid',
ALTER COLUMN "bgColor1" SET DEFAULT '#ffffff',
ALTER COLUMN "bgColor2" SET DEFAULT '#f0f0f0',
ALTER COLUMN "textColor" SET DEFAULT '#000000',
ALTER COLUMN "primaryColor" SET DEFAULT '#3b82f6',
ALTER COLUMN "cardStyle" SET DEFAULT 'solid',
ALTER COLUMN "borderRadius" SET DEFAULT 'rounded-lg',
ALTER COLUMN "disableRotation" DROP NOT NULL,
ALTER COLUMN "moveParticlesOnHover" DROP NOT NULL,
ALTER COLUMN "particleBaseSize" DROP NOT NULL,
ALTER COLUMN "particleCount" DROP NOT NULL,
ALTER COLUMN "particleSpeed" DROP NOT NULL,
ALTER COLUMN "particleSpread" DROP NOT NULL,
ALTER COLUMN "flBendRadius" DROP NOT NULL,
ALTER COLUMN "flBendStrength" DROP NOT NULL,
ALTER COLUMN "flLineCount" DROP NOT NULL,
ALTER COLUMN "flLineDistance" DROP NOT NULL,
ALTER COLUMN "flParallax" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "docUrl" TEXT,
ADD COLUMN     "huggingFaceUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;
