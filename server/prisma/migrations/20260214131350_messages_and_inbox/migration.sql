/*
  Warnings:

  - The primary key for the `BiometricCredential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `template` on table `GeneralInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `disableRotation` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moveParticlesOnHover` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `particleBaseSize` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `particleCount` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `particleSpeed` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `particleSpread` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flBendRadius` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flBendStrength` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flLineCount` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flLineDistance` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flParallax` on table `PlaygroundConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BiometricCredential" DROP CONSTRAINT "BiometricCredential_pkey",
ALTER COLUMN "deviceName" DROP NOT NULL,
ALTER COLUMN "deviceName" DROP DEFAULT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BiometricCredential_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BiometricCredential_id_seq";

-- AlterTable
ALTER TABLE "GeneralInfo" ALTER COLUMN "template" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "company" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'general';

-- AlterTable
ALTER TABLE "PlaygroundConfig" ALTER COLUMN "disableRotation" SET NOT NULL,
ALTER COLUMN "moveParticlesOnHover" SET NOT NULL,
ALTER COLUMN "particleBaseSize" SET NOT NULL,
ALTER COLUMN "particleCount" SET NOT NULL,
ALTER COLUMN "particleSpeed" SET NOT NULL,
ALTER COLUMN "particleSpread" SET NOT NULL,
ALTER COLUMN "flBendRadius" SET NOT NULL,
ALTER COLUMN "flBendStrength" SET NOT NULL,
ALTER COLUMN "flLineCount" SET NOT NULL,
ALTER COLUMN "flLineDistance" SET NOT NULL,
ALTER COLUMN "flParallax" SET NOT NULL;
