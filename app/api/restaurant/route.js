import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import cloudinary from "@/lib/cloudinary";

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

    let photoUrl = null;

    if (logo) {
      // Upload the image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(logo, {
        folder: "menu_photos", // Optional: specify a folder in Cloudinary
        // You can add more options here if needed
      });

      photoUrl = uploadResponse.secure_url;
    }

    // Create the new restaurant
    const newRestaurant = await db.restaurant.create({
      data: {
        name: restaurantName,
        email,
        adminName,
        password: hashedPassword,
        location,
        phoneNumber,
        logo: photoUrl, //
      },
    });

    const { password: newUserPassword, ...restaurantData } = newRestaurant;

    // res.status(200).json({ restaurantId: restaurant.id });
    return NextResponse.json(
      {
        restaurantId: newRestaurant.id,
        adminName: newRestaurant.adminName,
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
