import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { toppings, quantity, restaurantId, menuId, userId } = body;
    //  console.log(toppings, quantity, restaurantId, menuId, userId);
    if (!menuId || !quantity || !restaurantId) {
      return NextResponse.json(
        {
          message: "Missing required fields: menuId, quantity, or restaurantId",
        },
        { status: 400 }
      );
    }

    const newOrder = await db.order.create({
      data: {
        toppings,
        restaurantId,
        quantity,
        menuId,
        userId,
      },
    });

    return NextResponse.json(
      {
        orderId: newOrder.id,
        message: "order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating new order:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating the menu item" },
      { status: 500 }
    );
  }
}
