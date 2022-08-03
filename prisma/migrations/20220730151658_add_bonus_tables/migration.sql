-- CreateEnum
CREATE TYPE "BonusType" AS ENUM ('coupon', 'highlight');

-- CreateEnum
CREATE TYPE "BonusStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BonusMeasure" AS ENUM ('percent', 'priority');

-- CreateTable
CREATE TABLE "Bonus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "BonusType" NOT NULL,
    "percent" DOUBLE PRECISION,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountBonus" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bonusId" TEXT NOT NULL,
    "status" "BonusStatus" NOT NULL,
    "measure" "BonusMeasure" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountBonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountBonus" ADD CONSTRAINT "AccountBonus_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBonus" ADD CONSTRAINT "AccountBonus_bonusId_fkey" FOREIGN KEY ("bonusId") REFERENCES "Bonus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
