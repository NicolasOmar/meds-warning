-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "daysToNotify" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
