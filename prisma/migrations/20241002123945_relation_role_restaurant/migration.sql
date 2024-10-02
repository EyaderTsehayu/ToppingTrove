/*
  Warnings:

  - Added the required column `restaurantId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
