import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/application/hooks/auth/useAuth";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/presentation/components/ui/use-toast";
import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, googleLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center mx-auto">
      <div className="px-6 py-4 md:w-[500px] flex flex-col mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <Button
            type="button"
            onClick={() => googleLogin()}
            className="rounded-full du-btn du-btn-secondary"
            disabled={isLoading}
          >
            <FcGoogle className="mr-2" />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
};
