-- CreateTable
CREATE TABLE "ClientLedger" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConfig" (
    "id" SERIAL NOT NULL,
    "fcmToken" TEXT,

    CONSTRAINT "AdminConfig_pkey" PRIMARY KEY ("id")
);
