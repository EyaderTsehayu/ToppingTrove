import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      location,
      phoneNumber,
      restaurantId,
      roles,
    } = body;

    var resId;
    if (restaurantId != undefined) {
      resId = parseInt(restaurantId);
    }

    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    const hashPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        location,
        phoneNumber,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "User created successfuly" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating new role:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
