import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { connect } from "mongoose";

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
    const resId = parseInt(restaurantId);
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
        // restaurantId: resId,
        roles: {
          connect: { id: roles },
        },
        restaurant: {
          connect: { id: resId },
        },
        // include: {
        //   roles: true, // Include roles in the response if needed
        // },
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
