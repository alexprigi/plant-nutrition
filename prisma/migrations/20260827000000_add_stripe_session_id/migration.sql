-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSessionId_key" ON "subscriptions"("stripeSessionId");
