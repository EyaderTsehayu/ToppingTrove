import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const loginResId = session?.user.restaurantId;

  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to update the order status." },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const { name, permissions } = body;

    // Check for required fields
    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        {
          message: "Missing required fields: role name or permissions",
        },
        { status: 400 }
      );
    }

    // Upsert the permissions (create if they don't exist)
    const permissionRecords = await Promise.all(
      permissions.map(async (permissionName) => {
        return db.permission.upsert({
          where: { name: permissionName }, // Search by permission name
          update: {}, // No update action needed
          create: { name: permissionName },
          // Create the permission if it doesn't exist
        });
      })
    );

    // Create the new role and associate the permissions
    const newRole = await db.role.create({
      data: {
        name,
        restaurantId: loginResId,
        permissions: {
          connect: permissionRecords.map((permission) => ({
            id: permission.id,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        roleId: newRole.id,
        message: "Role created successfully with permissions",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating new role:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating the role" },
      { status: 500 }
    );
  }
}
