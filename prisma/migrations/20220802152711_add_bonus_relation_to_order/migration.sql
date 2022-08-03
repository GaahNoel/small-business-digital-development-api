/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `AccountBonus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AccountBonus" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "accountBonusId" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "AccountBonus_orderId_key" ON "AccountBonus"("orderId");

-- AddForeignKey
ALTER TABLE "AccountBonus" ADD CONSTRAINT "AccountBonus_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
