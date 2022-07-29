/*
  Warnings:

  - You are about to drop the column `maxCouponPermitted` on the `Business` table. All the data in the column will be lost.
  - Added the required column `maxPermittedCouponPercentage` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "maxCouponPermitted",
ADD COLUMN     "maxPermittedCouponPercentage" DOUBLE PRECISION;
