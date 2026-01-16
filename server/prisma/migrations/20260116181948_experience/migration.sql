-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "content" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlaygroundConfig" ALTER COLUMN "bgType" SET DEFAULT 'gradient',
ALTER COLUMN "bgColor1" SET DEFAULT '#0f172a',
ALTER COLUMN "bgColor2" SET DEFAULT '#1e293b',
ALTER COLUMN "textColor" SET DEFAULT '#f8fafc',
ALTER COLUMN "primaryColor" SET DEFAULT '#38bdf8',
ALTER COLUMN "cardStyle" SET DEFAULT 'glass',
ALTER COLUMN "borderRadius" SET DEFAULT 'rounded-2xl';

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "period" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
