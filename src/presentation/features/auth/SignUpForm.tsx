import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";
import { useToast } from "@/presentation/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/application/hooks/auth/useAuth";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signupSchema>;

export const SignUpForm = () => {
  const { signUp, googleLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data);
      toast({
        title: "Account created successfully",
        description: "Redirecting to the dashboard...",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center mx-auto">
      <div className="px-6 py-4 w-[500px] flex flex-col mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <Input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full text-white h-8"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full text-white h-8"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full text-white h-8"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="rounded-full du-btn du-btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="flex justify-center items-center">
            <Button
              onClick={googleLogin}
              type="button"
              className="flex items-center gap-2 rounded-full du-btn du-btn-secondary"
              disabled={isLoading}
            >
              <FcGoogle className="text-2xl" />
              <span>Continue with Google</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
