import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db"; // Assuming Prisma is initialized in db
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  try {
    // Fetch all users and include their associated permissions
    const users = await db.user.findMany({
      where: {
        restaurantId: loginResId, // Add the where condition
      },
    });

    // Format the response data to match your requirement
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching users" },
      { status: 500 }
    );
  }
}
