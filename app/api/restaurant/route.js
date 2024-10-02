import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      restaurantName,
      adminName,
      email,
      password,
      location,
      phoneNumber,
      logo,
    } = body;

    // Hash the restaurant password
    const hashedPassword = await hash(password, 10);

    // Convert the logo from Base64 to a Buffer
    const logoBuffer = Buffer.from(logo, "base64");

    // Create the new restaurant
    const newRestaurant = await db.restaurant.create({
      data: {
        name: restaurantName,
        email,
        adminName,
        password: hashedPassword,
        location,
        phoneNumber,
        logo: logoBuffer, // Save logo as bytes
      },
    });

    const { password: newUserPassword, ...restaurantData } = newRestaurant;

    // res.status(200).json({ restaurantId: restaurant.id });
    return NextResponse.json(
      {
        restaurantId: newRestaurant.id,
        message: "Restaurant created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
