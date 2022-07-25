/*
  Warnings:

  - The values [rebuy] on the enum `ChallengeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeType_new" AS ENUM ('buyAny', 'sellAny', 'buyProximity', 'buyback', 'buyProduct', 'buyService', 'sellProduct', 'sellService');
ALTER TABLE "Challenge" ALTER COLUMN "type" TYPE "ChallengeType_new" USING ("type"::text::"ChallengeType_new");
ALTER TYPE "ChallengeType" RENAME TO "ChallengeType_old";
ALTER TYPE "ChallengeType_new" RENAME TO "ChallengeType";
DROP TYPE "ChallengeType_old";
COMMIT;
