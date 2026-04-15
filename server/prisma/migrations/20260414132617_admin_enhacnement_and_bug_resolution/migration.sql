-- AlterTable
ALTER TABLE "AdminConfig" ADD COLUMN     "brochureLogo" TEXT,
ADD COLUMN     "customFields" TEXT,
ADD COLUMN     "trustPoints" TEXT;

-- AlterTable
ALTER TABLE "ClientLedger" ADD COLUMN     "emiDetails" TEXT,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "serviceIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
