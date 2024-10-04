"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "../ui/CustomInput";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "react-toastify";

// Zod schema for validation
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const SignInForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    const session = await getSession(); // Get the updated session after sign-in
    const userEmail = data.email;
    // fetch the status of user
    let role;
    try {
      const url = "/api/user/signin-user"; // Base URL
      const fullUrl = `${url}?email=${encodeURIComponent(userEmail)}`; // Full URL with query param
      const response = await fetch(fullUrl); // Fetch request

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const fetchedData = await response.json();
      console.log("fetchedData", fetchedData);

      role = fetchedData.roles[0].name;
      console.log(role);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    try {
      const signInData = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInData?.error) {
        throw new Error(signInData.error);
        toast.error("Login Failed");
      }
      if (role != null) {
        router.replace("/dashboard/orders");
        toast.success("Login Successful!");
      } else {
        router.replace("/order");
        toast.success("Login Successful!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }

    // if (signInData?.error) {
    //   console.error(signInData.error);
    // } else {
    //   const fetchedData = await response.json("/api/user/");
    //   router.push("/dashboard/orders");
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* Remember Me Checkbox */}
      <FormControlLabel
        control={<Checkbox color="primary" {...register("rememberMe")} />}
        label="Remember Me"
      />

      {/* Sign In Button */}
      <Button
        type="submit"
        variant="contained"
        className="bg-primary"
        fullWidth
      >
        Sign In
      </Button>

      {/* Link to Registration Page */}
      <div className="text-center mt-4">
        <span>Have not an account? </span>
        <Link href="/sign-up" className="text-primary">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
