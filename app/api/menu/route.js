import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Fetch all menu items with restaurant data
    const menus = await db.menu.findMany({
      include: {
        restaurant: {
          select: {
            id: true,
            name: true, // Fetch only the restaurant name
            logo: true,
          },
        },
      },
    });

    // Convert images from bytes to base64
    const formattedMenus = menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      toppings: menu.toppings,
      price: menu.price,
      photo: menu.photo,
      restaurantName: menu.restaurant.name,
      restaurantId: menu.restaurant.id,
      //  logo: `/${menu.restaurant.logo}`,
    }));

    return NextResponse.json(formattedMenus, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { message: "Error fetching menus" },
      { status: 500 }
    );
  }
}
