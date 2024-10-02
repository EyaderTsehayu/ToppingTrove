/*
  Warnings:

  - You are about to drop the `Topping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MenuToppings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuToppings" DROP CONSTRAINT "_MenuToppings_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuToppings" DROP CONSTRAINT "_MenuToppings_B_fkey";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "toppings" TEXT[];

-- DropTable
DROP TABLE "Topping";

-- DropTable
DROP TABLE "_MenuToppings";
