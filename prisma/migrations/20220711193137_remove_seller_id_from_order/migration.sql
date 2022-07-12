/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sellerId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sellerId";
