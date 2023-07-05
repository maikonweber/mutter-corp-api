/*
  Warnings:

  - Added the required column `description` to the `lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lead" ADD COLUMN     "description" TEXT NOT NULL;
