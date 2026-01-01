/*
  Warnings:

  - Added the required column `presentationId` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "presentationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MedicinePresentation" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(75) NOT NULL,

    CONSTRAINT "MedicinePresentation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "MedicinePresentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
