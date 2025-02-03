//@ts-nocheck
"use client"
import DesignerSignupForm from "@/components/auth/DesignerSignupForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DesignerSignupPage = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.8,
				staggerChildren: 0.3
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" }
		}
	};

	const fadeInScale = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.6, ease: "easeOut" }
		}
	};

	const floatingAnimation = {
		y: ["-0.5rem", "0.5rem"],
		transition: {
			duration: 2.5,
			repeat: Infinity,
			repeatType: "reverse",
			ease: "easeInOut"
		}
	};

	const backgroundPatternVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 0.2,
			transition: {
				duration: 1.5
			}
		}
	};

	return (
		<div className="relative w-full min-h-screen bg-background text-white overflow-hidden">
			{/* Animated Background Patterns */}
			<motion.div
				className="absolute inset-0 pointer-events-none"
				variants={backgroundPatternVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_-20%,rgba(255,125,5,0.15),transparent_70%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_80%,rgba(255,125,5,0.1),transparent_50%)]" />
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
						backgroundSize: '50px 50px'
					}}
				/>
			</motion.div>

			{/* Logo Section */}
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="fixed top-5 left-5 z-50"
			>
				<Link href="/" className="group">
					<div className="flex flex-col transition-all duration-300 transform group-hover:-translate-y-1">
						<motion.h1
							whileHover={{ color: "#FF7D05" }}
							className="font-heading1 text-xl md:text-2xl text-white"
						>
							Deauth
						</motion.h1>
						<motion.h2
							whileHover={{ color: "#FF7D05" }}
							className="font-heading1 text-xs text-white/60"
						>
							Where Art Meets Apparel
						</motion.h2>
					</div>
				</Link>
			</motion.div>

			{/* Main Container */}
			<div className="flex min-h-screen w-full max-w-[1920px] mx-auto flex-col lg:flex-row">
				{/* Left Section - Cover Image */}
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
					className="relative lg:w-1/2 bg-black min-h-[40vh] lg:min-h-screen overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-white/40 to-black/80">
						<Image
							src="/logo.jpeg"
							alt="Designer signup background"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
							className="opacity-60 mix-blend-overlay transform scale-100 hover:scale-105 transition-transform duration-700 object-cover"
						/>
					</div>
					<div className="relative z-10 flex flex-col justify-center p-8 lg:p-16 h-full">
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="space-y-6"
						>
							<motion.h2
								variants={itemVariants}
								className="text-3xl md:text-4xl lg:text-5xl font-heading1 text-white"
							>
								Join Our Creative{" "}
								<motion.span
									animate={{ color: ["#FF7D05", "#FF5500", "#FF7D05"] }}
									transition={{ duration: 3, repeat: Infinity }}
								>
									Community
								</motion.span>
							</motion.h2>

							<motion.p
								variants={itemVariants}
								className="text-lg md:text-xl text-white/80 max-w-md"
							>
								Share your unique designs with the world and start earning from your creativity.
							</motion.p>

							<motion.div
								variants={containerVariants}
								className="flex flex-col gap-4 text-base md:text-lg text-white/70"
							>
								{[
									"Set up your own designer shop",
									"Reach global customers",
									"Earn from every sale"
								].map((text, index) => (
									<motion.div
										key={index}
										variants={itemVariants}
										whileHover={{ x: 10 }}
										className="flex items-center gap-3"
									>
										<motion.svg
											animate={floatingAnimation}
											className="w-6 h-6 text-accent"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</motion.svg>
										<span>{text}</span>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					</div>
				</motion.div>

				{/* Right Section - Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
					className="flex-1 flex justify-center items-center p-4 md:p-8 lg:p-12"
				>
					<motion.div
						variants={fadeInScale}
						initial="hidden"
						animate="visible"
						className="w-full max-w-3xl"
					>
						<motion.div
							whileHover={{ boxShadow: "0 0 30px rgba(255,125,5,0.1)" }}
							className="bg-secondaryBackground rounded-3xl shadow-xl p-6 md:p-10 lg:p-16 border border-white/10"
						>
							{/* Mobile Title */}
							<AnimatePresence>
								<motion.div
									variants={itemVariants}
									initial="hidden"
									animate="visible"
									className="lg:hidden text-center mb-8"
								>
									<h2 className="text-2xl md:text-3xl font-heading1 text-white mb-2">
										Join Our Creative Community
									</h2>
									<p className="text-sm text-white/80">
										Start your journey as a designer
									</p>
								</motion.div>
							</AnimatePresence>

							{/* Form Component */}
							<DesignerSignupForm />
						</motion.div>
					</motion.div>
				</motion.div>
			</div>

			{/* Help Link */}
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1 }}
				className="fixed bottom-5 right-5"
			>
				<Link
					href="/help/designers"
					className="group bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full 
            text-white/60 hover:text-white text-sm flex items-center gap-2 
            transition-all duration-300 hover:bg-black/50"
				>
					Need help?
					<motion.svg
						whileHover={{ rotate: 12 }}
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
						/>
					</motion.svg>
				</Link>
			</motion.div>
		</div>
	);
};

export default DesignerSignupPage;