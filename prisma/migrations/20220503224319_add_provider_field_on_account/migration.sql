/*
  Warnings:

  - Added the required column `provider` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('facebook', 'google', 'credentials');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "provider" "Provider" NOT NULL;
