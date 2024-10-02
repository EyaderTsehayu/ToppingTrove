import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to update the order status." },
      { status: 401 }
    );
  }

  try {
    // Parse the request body to get new status
    const body = await req.json();
    const { status } = body;

    // Extract order ID from the request URL
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Invalid order ID or status." },
        { status: 400 }
      );
    }

    // Find and update the order in the database
    const updatedOrder = await db.order.update({
      where: {
        id: orderId,
        restaurantId: loginResId, // Ensure it's from the correct restaurant
      },
      data: {
        status, // Update the status
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Order status updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Error updating order status" },
      { status: 500 }
    );
  }
}
