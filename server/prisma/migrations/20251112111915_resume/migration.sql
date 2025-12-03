/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GeneralInfo" ADD COLUMN     "resumeUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
