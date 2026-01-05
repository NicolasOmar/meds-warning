-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "laboratory" TEXT,
    "presentation" TEXT,
    "expirationDate" TIMESTAMP(3),
    "usedFor" TEXT,
    "sideEffects" TEXT,
    "comments" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);
