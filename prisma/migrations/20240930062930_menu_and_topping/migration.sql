-- CreateTable
CREATE TABLE "Topping" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Topping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "photo" BYTEA NOT NULL,
    "restaurantId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuToppings" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Topping_name_key" ON "Topping"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToppings_AB_unique" ON "_MenuToppings"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToppings_B_index" ON "_MenuToppings"("B");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToppings" ADD CONSTRAINT "_MenuToppings_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToppings" ADD CONSTRAINT "_MenuToppings_B_fkey" FOREIGN KEY ("B") REFERENCES "Topping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
