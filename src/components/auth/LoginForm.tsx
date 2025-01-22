"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { AuthLoadingOverlay } from "./AuthLoadingOverlay";
import PasswordField from './PasswordField';
import { motion } from "framer-motion";

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.status !== 200) {
        setError(result.message || 'Invalid credentials');
        return;
      }
      console.log("got_signedin", result);
      // Store session data
      sessionStorage.setItem('userID', result.data._id);
      if (result.data.isDesigner) {
        sessionStorage.setItem('idDesigner', result.data.designerId);
      }

      toast({
        title: "Welcome back!",
        description: "Login successful",
      });

      router.push('/');

    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('Google authentication failed');
        return;
      }

      router.push(result?.url || '/');

    } catch (error) {
      setError('Failed to connect with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLoadingOverlay
        isLoading={isLoading}
        error={error}
        onErrorDismiss={() => setError(null)}
      />

      <div className="w-full h-full flex flex-col justify-center mx-auto">
        <div className="px-6 py-4 md:w-[500px] flex flex-col mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="relative group">
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full h-8 text-white placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-none outline-none placeholder:text-white/70 focus:ring-1 focus:ring-accent/50 transition-all duration-200"
                  type="email"
                  placeholder="Email"
                  disabled={isLoading}
                />
                {/* Email validation indicator */}
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-300 bg-accent"
                    style={{
                      width: watch('email')?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i) ? '100%' :
                        watch('email')?.includes('@') ? '66%' :
                          watch('email')?.length > 0 ? '33%' : '0%'
                    }}
                  />
                </div>
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 font-semibold px-4"
                >
                  <span className="font-bold italic mr-1">!</span>
                  {errors.email.message as string}
                </motion.p>
              )}
            </div>

            <PasswordField
              register={register}
              errors={errors}
              isLoading={isLoading}
            />

            <motion.div
              className="flex flex-col gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full px-10 py-2 bg-accent hover:bg-accent/90 text-white transition-colors duration-300 disabled:opacity-50"
              >
                Login
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-white/40">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="rounded-full px-10 py-2 bg-white/5 hover:bg-white/10 text-white transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FcGoogle className="text-2xl" />
                <span>Google</span>
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;