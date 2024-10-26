import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  // Extract search parameter from the query
  const search = req.nextUrl.searchParams.get("search") || "";

  // Build search condition if search parameter exists
  const searchCondition = search
    ? {
        OR: [
          {
            menu: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          // {
          //   phoneNumber: {
          //     contains: search,
          //     mode: "insensitive",
          //   },
          // },
        ],
      }
    : {};

  try {
    // Fetch orders with search filtering
    const orders = await db.order.findMany({
      where: {
        restaurantId: loginResId,
        ...searchCondition, // Add the search condition if it exists
      },
      include: {
        menu: {
          select: {
            name: true, // Fetch only the restaurant name
            photo: true,
          },
        },
      },
    });

    // Convert images from bytes to base64 if needed and format response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      name: order.menu.name,
      toppings: order.toppings,
      quantity: order.quantity,
      photo: order.menu.photo,
      status: order.status,
      createdAt: order.createdAt,
      phoneNumber: order.phoneNumber,
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}

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
    const orderIds = searchParams.get("id");
    const orderId = parseInt(orderIds);
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
