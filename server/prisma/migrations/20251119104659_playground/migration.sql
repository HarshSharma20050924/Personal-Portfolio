/*
  Warnings:

  - Made the column `profileImageUrl` on table `GeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `template` on table `GeneralInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
CREATE SEQUENCE generalinfo_id_seq;
ALTER TABLE "GeneralInfo" ALTER COLUMN "id" SET DEFAULT nextval('generalinfo_id_seq'),
ALTER COLUMN "profileImageUrl" SET NOT NULL,
ALTER COLUMN "template" SET NOT NULL;
ALTER SEQUENCE generalinfo_id_seq OWNED BY "GeneralInfo"."id";

-- CreateTable
CREATE TABLE "PlaygroundConfig" (
    "id" SERIAL NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Experimental Hero',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Testing new aesthetics',
    "bgType" TEXT NOT NULL DEFAULT 'gradient',
    "bgColor1" TEXT NOT NULL DEFAULT '#0f172a',
    "bgColor2" TEXT NOT NULL DEFAULT '#334155',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "primaryColor" TEXT NOT NULL DEFAULT '#38bdf8',
    "cardStyle" TEXT NOT NULL DEFAULT 'glass',
    "borderRadius" TEXT NOT NULL DEFAULT 'rounded-2xl',
    "showHero" BOOLEAN NOT NULL DEFAULT true,
    "showSkills" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "animationSpeed" TEXT NOT NULL DEFAULT 'normal',

    CONSTRAINT "PlaygroundConfig_pkey" PRIMARY KEY ("id")
);
