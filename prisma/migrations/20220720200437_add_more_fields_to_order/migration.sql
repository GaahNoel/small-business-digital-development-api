/*
  Warnings:

  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CreditCard', 'Cash');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;
