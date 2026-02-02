/*
  Warnings:

  - You are about to drop the column `likedMovie` on the `UserForm` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `UserForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserForm" DROP CONSTRAINT "UserForm_email_fkey";

-- AlterTable
ALTER TABLE "UserForm" DROP COLUMN "likedMovie",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "UserForm_email_key" ON "UserForm"("email");
