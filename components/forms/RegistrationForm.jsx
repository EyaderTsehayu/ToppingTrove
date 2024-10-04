"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../ui/CustomInput";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Zod schema for validation
const registrationSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" }),
    location: z.string().min(1, { message: "Location is required" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // set the error path to confirmPassword
  });

const RegistrationForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data) => {
    const response = await fetch("/api/user/normalUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        location: data.location,
        phoneNumber: data.phoneNumber,
      }),
    });

    if (response.ok) {
      router.push("/sign-in");
      toast.success("Registration Successful");
    } else {
      console.log("Registration Failed");
      toast.error("Registration Failed");
    }

    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CustomInput
        label="Email Address"
        {...register("email")}
        error={errors.email}
        helperText={errors.email?.message}
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

      <CustomInput
        label="Location"
        {...register("location")}
        error={errors.location}
        helperText={errors.location?.message}
      />

      <CustomInput
        label="Phone Number"
        {...register("phoneNumber")}
        error={errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
      />

      <FormControlLabel
        control={<Checkbox {...register("acceptTerms")} color="primary" />}
        label="I accept the Terms and Conditions"
      />
      {errors.acceptTerms && (
        <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
      )}

      <Button
        type="submit"
        variant="contained"
        className="bg-primary "
        fullWidth
      >
        Sign Up
      </Button>
      <div className="flex justify-between text-center mt-4">
        <div>
          <span>Already have an account? </span>
          <Link href="/sign-in" className="text-primary">
            Login
          </Link>
        </div>

        <Link href="/register" className="text-primary">
          Register Restaurants{" "}
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
