-- CreateTable
CREATE TABLE "AccountWatchedVideos" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountWatchedVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountWatchedVideos" ADD CONSTRAINT "AccountWatchedVideos_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
