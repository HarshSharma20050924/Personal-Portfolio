/*
  Warnings:

  - The primary key for the `BiometricCredential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BiometricCredential` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `url` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `featured` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `heroTitle` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `heroSubtitle` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `featured` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "featured" SET NOT NULL;

-- AlterTable
ALTER TABLE "BiometricCredential" DROP CONSTRAINT "BiometricCredential_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "deviceName" SET DEFAULT 'Unknown Device',
ADD CONSTRAINT "BiometricCredential_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlaygroundConfig" ALTER COLUMN "heroTitle" SET NOT NULL,
ALTER COLUMN "heroTitle" SET DEFAULT 'Playground Mode',
ALTER COLUMN "heroSubtitle" SET NOT NULL,
ALTER COLUMN "heroSubtitle" SET DEFAULT 'Experimenting with colors, shapes, and layouts.';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "showInFreelance" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "featured" SET NOT NULL;
