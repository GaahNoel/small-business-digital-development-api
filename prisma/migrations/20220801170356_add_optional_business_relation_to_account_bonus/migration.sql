-- AlterTable
ALTER TABLE "AccountBonus" ADD COLUMN     "businessId" TEXT;

-- AddForeignKey
ALTER TABLE "AccountBonus" ADD CONSTRAINT "AccountBonus_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
