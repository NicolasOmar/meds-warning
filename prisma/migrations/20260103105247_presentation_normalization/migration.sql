/*
  Warnings:

  - You are about to drop the column `presentationId` on the `Medicine` table. All the data in the column will be lost.
  - Added the required column `presentation` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_presentationId_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "presentationId",
DROP COLUMN "presentation",
ADD COLUMN     "presentation" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_presentation_fkey" FOREIGN KEY ("presentation") REFERENCES "MedicinePresentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
