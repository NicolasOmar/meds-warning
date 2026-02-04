-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "laboratory" VARCHAR(50),
    "presentation" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "usedFor" VARCHAR(75),
    "sideEffects" VARCHAR(100),
    "comments" VARCHAR(200),

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicinePresentation" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(75) NOT NULL,

    CONSTRAINT "MedicinePresentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "daysToNotify" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "daysToNotify" INTEGER NOT NULL DEFAULT 30,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_presentation_fkey" FOREIGN KEY ("presentation") REFERENCES "MedicinePresentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
