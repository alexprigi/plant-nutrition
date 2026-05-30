/*
  Warnings:

  - A unique constraint covering the columns `[followUpToken]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "rescheduleCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rescheduleCountRestricted" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "followUpToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_followUpToken_key" ON "subscriptions"("followUpToken");
