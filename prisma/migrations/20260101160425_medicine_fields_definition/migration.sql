/*
  Warnings:

  - You are about to alter the column `name` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `laboratory` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `presentation` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `usedFor` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(75)`.
  - You are about to alter the column `sideEffects` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `comments` on the `Medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "laboratory" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "presentation" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "usedFor" SET DATA TYPE VARCHAR(75),
ALTER COLUMN "sideEffects" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "comments" SET DATA TYPE VARCHAR(200);
