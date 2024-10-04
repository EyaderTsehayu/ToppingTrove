"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../ui/CustomInput";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

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
  const [adminName, setAdminName] = useState(null);
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
        const { restaurantId, adminName } = await response.json();
        setRestaurantId(restaurantId); // Save the restaurant ID for the next form
        setAdminName(adminName);
        toast.success("Registration Successful");
      } else {
        console.log("Restaurant registration failed");
        toast.success("Restaurant registration failed");
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
        name: adminName,
        email: data.email,
        password: data.password,
        location: data.location,
        phoneNumber: data.phoneNumber,
        restaurantId: restaurantId,
        roles: 10,
      }),
    });

    if (response.ok) {
      router.push("/sign-in");
      toast.success("Admin Registered Successfully");
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
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="logo-upload"
              className="flex gap-2 items-center justify-center  px-10 py-3 rounded-md border-2 border-dotted border-gray-600 cursor-pointer hover:border-orange-500 transition duration-200 ease-in-out"
            >
              <LuUpload className="flex text-lg text-primary mb-2" />
              <span className="text-primary">Upload Logo</span>
              {logo && (
                <p className="text-sm text-gray-500">
                  Selected logo: {logo.name}
                </p>
              )}
            </label>
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>
          {/* <div className="mb-4">
            <input
              id="pizza-photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />

            <label
              htmlFor="pizza-photo-upload"
              className="flex gap-2 items-center justify-center  px-10 py-3 rounded-md border-2 border-dotted border-gray-600 cursor-pointer hover:border-orange-500 transition duration-200 ease-in-out"
            >
              <LuUpload className="flex text-lg text-primary mb-2" />
              <span className="text-primary">Upload Pizza Photo</span>
            </label>

            {image && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: {image.name}
              </p>
            )}
          </div> */}

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
