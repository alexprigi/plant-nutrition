-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('BLOCK', 'OPEN');

-- AlterTable
ALTER TABLE "availability_blocks" ADD COLUMN     "type" "AvailabilityType" NOT NULL DEFAULT 'BLOCK';
