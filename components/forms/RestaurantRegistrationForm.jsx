"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../ui/CustomInput";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Zod schema for validation
const restaurantRegistrationSchema = z
  .object({
    adminName: z.string().min(1, { message: "Admin name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    restaurantName: z
      .string()
      .min(1, { message: "Restaurant name is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    // logo: z.any().refine((file) => file && file.length === 1, {
    //   message: "Logo is required",
    // }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // set the error path to confirmPassword
  });

const RestaurantRegistrationForm = () => {
  const router = useRouter();
  const [logo, setLogo] = useState();
  const [restaurantId, setRestaurantId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restaurantRegistrationSchema),
  });

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  // Create FormData to handle file upload
  const onRestaurantSubmit = async (data) => {
    //  console.log("Data from", data);

    try {
      const logoBase64 = await convertFileToBase64(logo);

      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminName: data.adminName,
          email: data.email,
          password: data.password,
          location: data.location,
          phoneNumber: data.phoneNumber,
          restaurantName: data.restaurantName,
          logo: logoBase64,
        }),
      });

      if (response.ok) {
        const { restaurantId } = await response.json();
        setRestaurantId(restaurantId); // Save the restaurant ID for the next form
      } else {
        console.log("Restaurant registration failed");
      }
    } catch (error) {
      console.error("some wrong went");
    }
    // Convert logo file to Base64
  };

  const onAdminSubmit = async (data) => {
    if (!restaurantId) {
      console.log(
        "No restaurant ID found. Please register the restaurant first."
      );
      return;
    }
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        location: data.location,
        phoneNumber: data.phoneNumber,
        restaurantId: restaurantId,
      }),
    });

    if (response.ok) {
      router.push("/sign-in");
    } else {
      console.log("Registration Failed");
    }

    // Handle form submission logic here
  };

  return (
    <div>
      {restaurantId == null && (
        <form onSubmit={handleSubmit(onRestaurantSubmit)} className="space-y-4">
          {/* Admin Name */}
          <CustomInput
            label="Admin Name"
            {...register("adminName")}
            error={errors.adminName}
            helperText={errors.adminName?.message}
          />

          {/* Email Address */}
          <CustomInput
            label="Email Address"
            {...register("email")}
            error={errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <CustomInput
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
            helperText={errors.password?.message}
          />

          {/* Confirm Password */}
          <CustomInput
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          {/* Phone Number */}
          <CustomInput
            label="Phone Number"
            {...register("phoneNumber")}
            error={errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />

          {/* Restaurant Name */}
          <CustomInput
            label="Restaurant Name"
            {...register("restaurantName")}
            error={errors.restaurantName}
            helperText={errors.restaurantName?.message}
          />

          {/* Location */}
          <CustomInput
            label="Location"
            {...register("location")}
            error={errors.location}
            helperText={errors.location?.message}
          />

          {/* Upload Logo */}
          <div>
            <label>Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>

          {/* Accept Terms and Conditions */}
          <FormControlLabel
            control={<Checkbox {...register("acceptTerms")} color="primary" />}
            label="I accept the Terms and Conditions"
          />
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            className="bg-primary"
            fullWidth
          >
            Sign Up
          </Button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <span>Already have an account? </span>
            <Link href="/sign-in" className="text-primary">
              Login
            </Link>
          </div>
        </form>
      )}
      {restaurantId && (
        <form onSubmit={handleSubmit(onAdminSubmit)} className="space-y-4">
          <CustomInput
            label="Admin Name"
            {...register("adminName")}
            error={errors.adminName}
            helperText={errors.adminName?.message}
          />

          <CustomInput
            label="Email Address"
            {...register("email")}
            error={errors.email}
            helperText={errors.email?.message}
          />

          <CustomInput
            label="Phone Number"
            {...register("phoneNumber")}
            error={errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />

          <CustomInput
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password}
            helperText={errors.password?.message}
          />

          <CustomInput
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            className="bg-primary "
            fullWidth
          >
            Continue
          </Button>
        </form>
      )}
    </div>
  );
};

export default RestaurantRegistrationForm;
