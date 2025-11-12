/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `profileImageUrl` on table `GeneralInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Skill_name_key";

-- AlterTable
ALTER TABLE "GeneralInfo" ALTER COLUMN "profileImageUrl" SET NOT NULL;

-- DropTable
DROP TABLE "Article";
