/*
  Warnings:

  - The `photo` column on the `Menu` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "photo",
ADD COLUMN     "photo" BYTEA;