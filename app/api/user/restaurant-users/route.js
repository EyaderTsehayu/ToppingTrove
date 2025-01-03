import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db"; // Assuming Prisma is initialized in db
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("search") || ""; // Get the search query

  try {
    const users = await db.user.findMany({
      where: {
        restaurantId: loginResId,
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { email: { contains: searchQuery, mode: "insensitive" } },
          { phoneNumber: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
    });

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
