/*
  Warnings:

  - You are about to drop the column `user_id` on the `desserts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "desserts" DROP CONSTRAINT "desserts_user_id_fkey";

-- AlterTable
ALTER TABLE "desserts" DROP COLUMN "user_id";
