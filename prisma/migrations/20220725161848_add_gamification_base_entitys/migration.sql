-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('buyAny', 'sellAny', 'buyProximity', 'rebuy', 'buyProduct', 'buyService');

-- CreateEnum
CREATE TYPE "Periodicity" AS ENUM ('daily', 'weekly');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('COMPLETED', 'PENDING');

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "goal" INTEGER NOT NULL,
    "periodicity" "Periodicity" NOT NULL,
    "reward" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveChallenge" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveChallenge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveChallenge" ADD CONSTRAINT "ActiveChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveChallenge" ADD CONSTRAINT "ActiveChallenge_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
