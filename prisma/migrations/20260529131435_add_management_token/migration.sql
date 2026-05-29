/*
  Warnings:

  - A unique constraint covering the columns `[managementToken]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - The required column `managementToken` was added to the `appointments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable: aggiungi come nullable, popola le righe esistenti, poi rendi NOT NULL
ALTER TABLE "appointments" ADD COLUMN "managementToken" TEXT;
UPDATE "appointments" SET "managementToken" = gen_random_uuid()::TEXT WHERE "managementToken" IS NULL;
ALTER TABLE "appointments" ALTER COLUMN "managementToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_managementToken_key" ON "appointments"("managementToken");
