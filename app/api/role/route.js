import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db"; // Assuming Prisma is initialized in db
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  try {
    // Fetch all roles and include their associated permissions
    const roles = await db.role.findMany({
      where: {
        restaurantId: loginResId, // Add the where condition
      },
      include: {
        permissions: true, // Include permissions associated with each role
      },
    });

    // Format the response data to match your requirement
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((permission) => permission.name), // Extract permission names
      createdAt: role.createdAt, // Assuming `createdAt` is a Date object in your schema
    }));

    return NextResponse.json(formattedRoles, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching roles" },
      { status: 500 }
    );
  }
}
