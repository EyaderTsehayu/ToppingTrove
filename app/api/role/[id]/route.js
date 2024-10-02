import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  var { id } = params;
  id = parseInt(id);

  //   const id = parseInt(Id);

  try {
    const body = await req.json();
    const { name, permissions } = body;

    console.log(name, permissions);
    // Validate input
    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        {
          message: "Missing or invalid required fields: name, permissions",
        },
        { status: 400 }
      );
    }

    // Check if the role exists
    const existingRole = await db.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!existingRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    const permissionRecords = await db.permission.findMany({
      where: {
        name: {
          in: permissions, // Match only existing permissions
        },
      },
    });

    // Update the role with new data
    const updatedRole = await db.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          // Replace existing permissions with the new set
          set: permissionRecords.map((perm) => ({ id: perm.id })),
        },
      },
      include: { permissions: true },
    });

    return NextResponse.json(
      {
        role: updatedRole,
        message: "Role updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { message: "Something went wrong while updating the role" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  var { id } = params;
  id = parseInt(id);

  try {
    // Check if the role exists
    const existingRole = await db.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Delete the role
    await db.role.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { message: "Something went wrong while deleting the role" },
      { status: 500 }
    );
  }
}
