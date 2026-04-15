-- CreateTable
CREATE TABLE "ProjectMedia" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "title" TEXT,

    CONSTRAINT "ProjectMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "company" TEXT,
    "text" TEXT NOT NULL,
    "projectUrl" TEXT,
    "showInClient" BOOLEAN NOT NULL DEFAULT true,
    "showInFreelance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectMedia" ADD CONSTRAINT "ProjectMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
