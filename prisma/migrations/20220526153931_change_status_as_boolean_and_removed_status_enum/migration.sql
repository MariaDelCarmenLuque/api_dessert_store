/*
  Warnings:

  - The `status` column on the `desserts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "desserts" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "Status";
