import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch the user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data if found
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error in API Route:", error);
    return NextResponse.json(
      {
        message: "Something went wrong while fetching the user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
