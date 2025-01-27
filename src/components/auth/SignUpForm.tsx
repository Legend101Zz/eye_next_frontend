import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Loader2, Mail, User } from "lucide-react";
import { AuthLoadingOverlay } from "./AuthLoadingOverlay";

const SignupForm = () => {
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

	const email = watch("email", "");
	const username = watch("username", "");
	const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	const isValidEmail = emailPattern.test(email);
	const isValidUsername = username.length >= 3;

	const onSubmit = async (data: any) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
				},
				body: JSON.stringify({
					email: data.email,
					username: data.username
				}),
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message || 'Signup failed');
			}

			toast({
				title: "Check your email!",
				description: "We've sent you a password to get started. Please check your inbox.",
			});

			setTimeout(() => {
				router.push('/auth/login');
			}, 3000);

		} catch (error: any) {
			setError(error.message || 'An unexpected error occurred');
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
				loadingMessage={"Creating Your Account..."}
				onErrorDismiss={() => setError(null)}
			/>

			<div className="w-full space-y-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-4">
						{/* Username Input */}
						<div className="space-y-2">
							<div className="relative group">
								<Input
									{...register("username", {
										required: "Username is required",
										minLength: {
											value: 3,
											message: "Username must be at least 3 characters"
										}
									})}
									placeholder="Choose a username"
									type="text"
									className="w-full h-11 text-white bg-black/20 border-accent/20 placeholder:text-white/40 focus:border-accent/50 transition-all duration-200"
									disabled={isLoading}
								/>
								<User
									className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isValidUsername ? 'text-accent' : 'text-white/20'
										}`}
								/>
							</div>

							<AnimatePresence mode="wait">
								{errors.username && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="text-sm text-red-500 px-1"
									>
										{errors.username.message as string}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Email Input */}
						<div className="space-y-2">
							<div className="relative group">
								<Input
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: emailPattern,
											message: "Please enter a valid email"
										}
									})}
									placeholder="Enter your email"
									type="email"
									className="w-full h-11 text-white bg-black/20 border-accent/20 placeholder:text-white/40 focus:border-accent/50 transition-all duration-200"
									disabled={isLoading}
								/>
								<Mail
									className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isValidEmail ? 'text-accent' : 'text-white/20'
										}`}
								/>

								<div className="absolute -bottom-px left-0 w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
									<motion.div
										className="h-full bg-accent"
										initial={{ width: "0%" }}
										animate={{
											width: email.includes('@') && email.includes('.') ? "100%" :
												email.includes('@') ? "66%" :
													email.length > 0 ? "33%" : "0%"
										}}
										transition={{ duration: 0.2 }}
									/>
								</div>
							</div>

							<AnimatePresence mode="wait">
								{errors.email && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="text-sm text-red-500 px-1"
									>
										{errors.email.message as string}
									</motion.p>
								)}
							</AnimatePresence>

							<motion.p
								className="text-white/40 text-sm px-1"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								We&apos;ll send you a secure password via email
							</motion.p>
						</div>
					</div>

					<div className="space-y-4">
						<button
							type="submit"
							disabled={isLoading || !isValidEmail || !isValidUsername}
							className="w-full h-11 rounded-full bg-accent disabled:opacity-50 disabled:hover:bg-accent hover:bg-accent/90 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								"Create Account"
							)}
						</button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/10"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-black text-white/40">or sign up with</span>
							</div>
						</div>

						<button
							type="button"
							onClick={handleGoogleAuth}
							disabled={isLoading}
							className="w-full h-11 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
						>
							<FcGoogle className="w-5 h-5" />
							<span>Google</span>
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default SignupForm;