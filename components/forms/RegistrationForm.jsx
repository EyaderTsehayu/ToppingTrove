"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../ui/CustomInput";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
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
      <div className="text-center mt-4">
        <span>Already have an account? </span>
        <Link href="/sign-in" className="text-primary">
          Login
        </Link>
      </div>
    </form>
  );
};

export default RegistrationForm;
