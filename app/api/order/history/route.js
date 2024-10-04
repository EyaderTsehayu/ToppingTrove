import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    var userId = searchParams.get("userId");
    userId = parseInt(userId);

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    // Fetch the user by userId
    const orders = await db.order.findMany({
      where: { userId: userId },
      include: {
        menu: {
          select: {
            name: true,
            price: true, // Fetch only the restaurant name
            photo: true,
          },
        },
      },
    });

    if (!orders) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      name: order.menu.name,
      toppings: order.toppings,
      quantity: order.quantity,
      photo: order.menu.photo,
      price: order.menu.price,
      status: order.status,
      // createdAt: order.createdAt,
      // phoneNumber: order.phoneNumber,
      //  logo: `/${menu.restaurant.logo}`,
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
    // Return the order data if found
    // return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error in API Route:", error);
    return NextResponse.json(
      {
        message: "Something went wrong while fetching the order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
