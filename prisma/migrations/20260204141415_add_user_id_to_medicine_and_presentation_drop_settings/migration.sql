-- DropTable
DROP TABLE "Settings";

-- AlterTable: add userId as nullable
ALTER TABLE "Medicine" ADD COLUMN     "userId" INTEGER;

-- AlterTable: add userId as nullable
ALTER TABLE "MedicinePresentation" ADD COLUMN     "userId" INTEGER;

-- Backfill existing rows with the first available user
UPDATE "Medicine" SET "userId" = (SELECT MIN("id") FROM "User");
UPDATE "MedicinePresentation" SET "userId" = (SELECT MIN("id") FROM "User");

-- Set NOT NULL after backfill
ALTER TABLE "Medicine" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "MedicinePresentation" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicinePresentation" ADD CONSTRAINT "MedicinePresentation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
