/*
  Warnings:

  - Added the required column `city` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;
