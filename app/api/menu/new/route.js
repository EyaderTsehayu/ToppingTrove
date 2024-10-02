// app/api/menu/new/route.js or pages/api/menu/new.js depending on your setup
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      toppings,
      price,
      photo, // Expecting photo as base64 string
      restaurantId,
    } = body;

    let photoUrl = null;

    if (photo) {
      // Upload the image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(photo, {
        folder: "menu_photos", // Optional: specify a folder in Cloudinary
        // You can add more options here if needed
      });

      photoUrl = uploadResponse.secure_url;
    }

    // Create the new menu item with the Cloudinary URL
    const newMenu = await db.menu.create({
      data: {
        name,
        toppings,
        price,
        photo: photoUrl,
        restaurantId,
      },
    });

    return NextResponse.json(
      {
        menuId: newMenu.id,
        message: "Menu created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating the menu item" },
      { status: 500 }
    );
  }
}

// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";
// export async function POST(req) {
//   try {
//     // Parse the incoming JSON body
//     const body = await req.json();
//     const {
//       name,
//       toppings,
//       price,
//       photo, // Expecting photo as base64 string
//       restaurantId, // Foreign key to the restaurant
//     } = body;

//     // Convert the photo from base64 to a Buffer
//     const photoBuffer = Buffer.from(photo, "base64");

//     // Create the new menu item
//     const newMenu = await db.menu.create({
//       data: {
//         name,
//         toppings, // Directly use the array of toppings
//         price,
//         photo: photoBuffer, // Save photo as bytes
//         restaurantId, // Foreign key to the restaurant
//       },
//     });

//     // Return the new menu item data in the response
//     return NextResponse.json(
//       {
//         menuId: newMenu.id,
//         message: "Menu created successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating menu item:", error);
//     return NextResponse.json(
//       { message: "Something went wrong while creating the menu item" },
//       { status: 500 }
//     );
//   }
// }
