//@ts-nocheck
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDesignerSignup } from "@/helpers/api/auth";
import { toast } from "../ui/use-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

enum AddressType {
	HOME = 'home',
	WORK = 'work',
	OTHER = 'other'
}

export type DesignerSignupFormValues = {
	clientName: string;
	artistName: string;
	clientDescription: string;
	phone: string | null;
	addressLine1: string;
	addressLine2: string;
	city: string;
	postalCode: string | null;
	addressType: AddressType;
	state: string;
	panCardNumber: string | null;
	portfolioLinks: string;
	cvLinks: string;
	coverPhoto: File | null;
	profilePhoto: File | null;
	country: string;
};

const DesignerSignupForm = () => {
	const router = useRouter();
	const profilePhotoRef = useRef<File | null>(null);
	const coverPhotoRef = useRef<File | null>(null);
	const [activeSection, setActiveSection] = useState<string>("images");
	const [dragActive, setDragActive] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
		setValue,
		watch
	} = useForm<DesignerSignupFormValues>();

	const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
	const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);

	// Get userId from session storage
	const userId = typeof window !== "undefined" ? sessionStorage.getItem("userID") : null;

	// Handle image upload via input change
	const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
		console.log('handlePhotoChange', event.target)
		const file = event.target.files?.[0];
		handleFileUpload(file, type);
	};

	// Handle drag and drop
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);
	};

	const handleDrop = (e: React.DragEvent, type: 'profile' | 'cover') => {
		e.preventDefault();
		setDragActive(false);
		const file = e.dataTransfer.files[0];
		handleFileUpload(file, type);
	};

	// Process file upload
	const handleFileUpload = (file: File | undefined, type: 'profile' | 'cover') => {
		if (!file) return;

		const maxSize = type === 'profile' ? 4 * 1024 * 1024 : 2 * 1024 * 1024;
		const validFormats = ["image/jpeg", "image/png"];
		const fieldName = type === 'profile' ? 'profilePhoto' : 'coverPhoto';

		if (!validFormats.includes(file.type)) {
			setError(fieldName, {
				type: "manual",
				message: "Please upload a JPEG or PNG image only"
			});
			return;
		}

		if (file.size > maxSize) {
			setError(fieldName, {
				type: "manual",
				message: `File must be smaller than ${maxSize / (1024 * 1024)}MB`
			});
			return;
		}

		clearErrors(fieldName);
		const reader = new FileReader();

		reader.onloadend = () => {
			if (type === 'profile') {
				profilePhotoRef.current = file;
				setSelectedProfileImage(reader.result as string);
			} else {
				coverPhotoRef.current = file;
				setSelectedCoverImage(reader.result as string);
			}
		};

		reader.readAsDataURL(file);
	};

	// Handle address type change
	const handleAddressTypeChange = (value: string) => {
		setValue('addressType', value as AddressType);
	};

	// Form submission handler
	const onSubmit = async (data: DesignerSignupFormValues) => {
		try {
			if (!userId) {
				toast({
					title: "Authentication Required",
					description: "Please sign up or log in first",
					variant: "destructive",
				});
				return;
			}

			if (!profilePhotoRef.current || !coverPhotoRef.current) {
				toast({
					title: "Images Required",
					description: "Please upload both profile and cover photos",
					variant: "destructive",
				});
				return;
			}

			const submissionData = {
				...data,
				userId,
				profilePhoto: profilePhotoRef.current,
				coverPhoto: coverPhotoRef.current,
			};

			await handleDesignerSignup(submissionData);

			toast({
				title: "Success!",
				description: "Your designer account has been created",
			});

			router.push('/profile/DesignerDashboard');

		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Failed to create account",
				variant: "destructive",
			});
		}
	};

	// Form sections configuration
	const formSections = [
		{ id: "images", title: "Profile Images" },
		{ id: "info", title: "Designer Information" },
		{ id: "contact", title: "Contact Details" },
		{ id: "address", title: "Address" },
		{ id: "links", title: "Professional Links" }
	];

	// Navigation component with mobile responsive design
	const SectionNav = () => (
		<div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
			<div className="flex flex-nowrap gap-2 px-4 md:px-0 w-full md:w-auto">
				{formSections.map((section) => (
					<button
						key={section.id}
						onClick={() => setActiveSection(section.id)}
						className={`px-3 md:px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-sm md:text-base ${activeSection === section.id
							? "bg-accent text-white"
							: "bg-black/20 text-white/60 hover:bg-black/30"
							}`}
					>
						{section.title}
					</button>
				))}
			</div>
		</div>
	);


	const LoadingOverlay = ({ show }) => {
		if (!show) return null;
		if (!isSubmitting) return null;

		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
			>
				<div className="text-center">
					<div className="relative w-24 h-24 mx-auto mb-8">
						{/* Outer rotating circle */}
						<motion.div
							className="absolute inset-0 border-4 border-t-accent border-r-accent/50 border-b-accent/30 border-l-accent/10 rounded-full"
							animate={{ rotate: 360 }}
							transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
						/>

						{/* Inner pulsing circle */}
						<motion.div
							className="absolute inset-4 border-4 border-accent rounded-full"
							animate={{
								scale: [1, 1.1, 1],
								opacity: [0.5, 1, 0.5]
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
					</div>

					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="space-y-4 text-white"
					>
						<h2 className="text-2xl font-heading1">Creating Your Account</h2>
						<p className="text-white/60">Please wait while we set up your designer profile...</p>

						{/* Progress dots */}
						<div className="flex justify-center gap-1">
							{[...Array(3)].map((_, i) => (
								<motion.div
									key={i}
									className="w-2 h-2 bg-accent rounded-full"
									animate={{
										scale: [1, 1.5, 1],
										opacity: [0.3, 1, 0.3]
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
										delay: i * 0.2
									}}
								/>
							))}
						</div>
					</motion.div>
				</div>
			</motion.div>
		);
	};

	// Image upload component
	const ImageUploadBox = ({ type, selectedImage, register, errors, handlePhotoChange }: {
		type: 'profile' | 'cover';
		selectedImage: string | null;
		register: any;
		errors: any;
		handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => void;
	}) => {
		const fileInputRef = useRef<HTMLInputElement>(null);

		const handleBoxClick = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			console.log('Clicking', fileInputRef.current);
			if (fileInputRef.current) {
				fileInputRef.current.click();
			}
		};


		return (
			<div className="w-full sm:w-auto">

				<div
					role="button"
					tabIndex={0}
					onClick={handleBoxClick}
					onKeyDown={(e) => e.key === 'Enter' && handleBoxClick(e as any)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={(e) => handleDrop(e, type)}
					className={`
            relative group cursor-pointer 
            transition-all duration-300
            ${dragActive ? "scale-105" : "hover:scale-[1.02]"}
            w-full sm:w-auto
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black
          `}
				>
					<div className={`
            relative overflow-hidden
            ${type === 'profile'
							? 'w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 rounded-full mx-auto'
							: 'w-full h-36 md:h-48 lg:h-64 rounded-xl'}
            ${selectedImage ? '' : 'border-2 border-dashed border-white/20'}
            bg-black/20 transition-all duration-300
            ${dragActive ? 'border-accent' : 'hover:border-white/40'}
          `}>
						{selectedImage ? (
							<Image
								src={selectedImage}
								alt={`${type} photo`}
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 group-hover:scale-105"
							/>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
								<svg className="w-6 h-6 md:w-8 md:h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<span className="text-xs md:text-sm text-white/40">
									{type === 'profile' ? 'Profile Photo' : 'Cover Photo'}
								</span>
								<span className="text-xs text-white/30">Click or Drag & Drop</span>
							</div>
						)}
					</div>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png"
						onChange={(e) => handlePhotoChange(e, type)}
						className="hidden"
						{...register(type === 'profile' ? 'profilePhoto' : 'coverPhoto')}
					/>
				</div>

				{errors[type === 'profile' ? 'profilePhoto' : 'coverPhoto'] && (
					<p className="text-destructive text-xs md:text-sm mt-2 text-center">
						{errors[type === 'profile' ? 'profilePhoto' : 'coverPhoto'].message}
					</p>
				)}

				<p className="text-white/40 text-xs text-center mt-2">
					{type === 'profile'
						? 'Upload a professional profile photo'
						: 'Upload a cover image for your profile'}
				</p>
				<p className="text-white/30 text-xs text-center">
					Max size: {type === 'profile' ? '4MB' : '2MB'} (JPEG or PNG)
				</p>
			</div>
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-4 md:px-0">
			<div className="flex flex-col gap-8 w-full text-white">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center space-y-2"
				>
					<h1 className="text-3xl md:text-4xl font-heading1">Designer Registration</h1>
					<p className="text-sm md:text-md text-white/60">Join our creative community</p>
				</motion.div>

				<SectionNav />

				<AnimatePresence mode="wait">
					<motion.div
						key={activeSection}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="w-full"
					>
						{/* Address Section with Address Type Dropdown */}
						{activeSection === "address" && (
							<div className="bg-black/20 rounded-2xl p-4 md:p-8 space-y-6">
								<div className="grid md:grid-cols-2 gap-4 md:gap-6">
									<div className="md:col-span-2 space-y-2">
										<Label>Address Line 1</Label>
										<Input
											{...register("addressLine1", {
												required: "Address is required"
											})}
											placeholder="Street address"
											className="bg-black/10"
										/>
										{errors.addressLine1 && (
											<p className="text-destructive text-sm">{errors.addressLine1.message}</p>
										)}
									</div>

									<div className="md:col-span-2 space-y-2">
										<Label>Address Line 2</Label>
										<Input
											{...register("addressLine2")}
											placeholder="Apartment, suite, etc. (optional)"
											className="bg-black/10"
										/>
									</div>

									<div className="space-y-2">
										<Label>Address Type</Label>
										<Select onValueChange={handleAddressTypeChange} defaultValue={AddressType.HOME}>
											<SelectTrigger className="w-full bg-black/10">
												<SelectValue placeholder="Select address type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={AddressType.HOME}>Home</SelectItem>
												<SelectItem value={AddressType.WORK}>Work</SelectItem>
												<SelectItem value={AddressType.OTHER}>Other</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>City</Label>
										<Input
											{...register("city", {
												required: "City is required"
											})}
											placeholder="Enter your city"
											className="bg-black/10"
										/>
										{errors.city && (
											<p className="text-destructive text-sm">{errors.city.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>State</Label>
										<Input
											{...register("state", {
												required: "State is required"
											})}
											placeholder="Enter your state"
											className="bg-black/10"
										/>
										{errors.state && (
											<p className="text-destructive text-sm">{errors.state.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>Postal Code</Label>
										<Input
											{...register("postalCode", {
												required: "Postal code is required",
												pattern: {
													value: /^[0-9]{6}$/,
													message: "Please enter a valid 6-digit postal code"
												}
											})}
											placeholder="Enter postal code"
											className="bg-black/10"
										/>
										{errors.postalCode && (
											<p className="text-destructive text-sm">{errors.postalCode.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>Country</Label>
										<Input
											{...register("country", {
												required: "Country is required"
											})}
											placeholder="Enter your country"
											className="bg-black/10"
										/>
										{errors.country && (
											<p className="text-destructive text-sm">{errors.country.message}</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Images Section */}
						{activeSection === "images" && (
							<div className="bg-black/20 rounded-2xl p-4 md:p-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
									<div className="w-full flex justify-center items-center">
										<ImageUploadBox
											type="profile"
											selectedImage={selectedProfileImage}
											register={register}
											errors={errors}
											handlePhotoChange={handlePhotoChange}
										/>
									</div>
									<div className="w-full flex justify-center items-center">
										<ImageUploadBox
											type="cover"
											selectedImage={selectedCoverImage}
											register={register}
											errors={errors}
											handlePhotoChange={handlePhotoChange}
										/>
									</div>
								</div>
							</div>
						)}

						{/* Designer Information Section */}
						{activeSection === "info" && (
							<div className="bg-black/20 rounded-2xl p-4 md:p-8 space-y-6">
								<div className="grid md:grid-cols-2 gap-4 md:gap-6">
									<div className="space-y-2">
										<Label>Designer Name</Label>
										<Input
											{...register("clientName", {
												required: "Designer name is required",
												minLength: { value: 2, message: "Name must be at least 2 characters" }
											})}
											placeholder="Your full name"
											className="bg-black/10"
										/>
										{errors.clientName && (
											<p className="text-destructive text-sm">{errors.clientName.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>Artist/Brand Name</Label>
										<Input
											{...register("artistName", {
												required: "Artist/Brand name is required",
												minLength: { value: 2, message: "Name must be at least 2 characters" }
											})}
											placeholder="Your creative identity"
											className="bg-black/10"
										/>
										{errors.artistName && (
											<p className="text-destructive text-sm">{errors.artistName.message}</p>
										)}
									</div>

									<div className="md:col-span-2 space-y-2">
										<Label>Design Philosophy & Style</Label>
										<Textarea
											{...register("clientDescription", {
												required: "Description is required",
												minLength: { value: 50, message: "Description must be at least 50 characters" }
											})}
											placeholder="Tell us about your design style and creative approach..."
											className="min-h-[120px] bg-black/10 resize-none"
										/>
										{errors.clientDescription && (
											<p className="text-destructive text-sm">{errors.clientDescription.message}</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Contact Details Section */}
						{activeSection === "contact" && (
							<div className="bg-black/20 rounded-2xl p-4 md:p-8 space-y-6">
								<div className="grid md:grid-cols-2 gap-4 md:gap-6">
									<div className="space-y-2">
										<Label>Phone Number</Label>
										<Input
											type="tel"
											{...register("phone", {
												required: "Phone number is required",
												pattern: {
													value: /^[0-9\s+\-()]{10,15}$/,
													message: "Please enter a valid phone number"
												}
											})}
											placeholder="+91 1234567890"
											className="bg-black/10"
										/>
										{errors.phone && (
											<p className="text-destructive text-sm">{errors.phone.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>PAN Card Number</Label>
										<Input
											{...register("panCardNumber", {
												pattern: {
													value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
													message: "Please enter a valid PAN number"
												}
											})}
											placeholder="ABCDE1234F"
											className="bg-black/10"
										/>
										{errors.panCardNumber && (
											<p className="text-destructive text-sm">{errors.panCardNumber.message}</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Professional Links Section */}
						{activeSection === "links" && (
							<div className="bg-black/20 rounded-2xl p-4 md:p-8 space-y-6">
								<div className="grid md:grid-cols-2 gap-4 md:gap-6">
									<div className="space-y-2">
										<Label>Portfolio Website</Label>
										<Input
											{...register("portfolioLinks", {
												pattern: {
													value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
													message: "Please enter a valid URL"
												}
											})}
											placeholder="https://your-portfolio.com"
											className="bg-black/10"
										/>
										{errors.portfolioLinks && (
											<p className="text-destructive text-sm">{errors.portfolioLinks.message}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label>CV/Resume Link</Label>
										<Input
											{...register("cvLinks", {
												pattern: {
													value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
													message: "Please enter a valid URL"
												}
											})}
											placeholder="https://your-cv.com"
											className="bg-black/10"
										/>
										{errors.cvLinks && (
											<p className="text-destructive text-sm">{errors.cvLinks.message}</p>
										)}
									</div>
								</div>
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Navigation and Submit Button */}
				<div className="flex flex-col gap-4 md:gap-6 pb-8">
					<div className="flex justify-between">
						<button
							type="button"
							onClick={() => {
								const currentIndex = formSections.findIndex(s => s.id === activeSection);
								if (currentIndex > 0) {
									setActiveSection(formSections[currentIndex - 1].id);
								}
							}}
							className="px-4 md:px-6 py-2 rounded-full text-white/60 hover:text-white transition-colors"
						>
							Previous
						</button>

						{activeSection !== formSections[formSections.length - 1].id && (
							<button
								type="button"
								onClick={() => {
									const currentIndex = formSections.findIndex(s => s.id === activeSection);
									if (currentIndex < formSections.length - 1) {
										setActiveSection(formSections[currentIndex + 1].id);
									}
								}}
								className="px-4 md:px-6 py-2 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors"
							>
								Next
							</button>
						)}

						{activeSection === formSections[formSections.length - 1].id && (
							<>
								<button
									type="submit"
									disabled={isSubmitting}
									className="px-6 md:px-8 py-2 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<div className="flex items-center gap-2">
											<div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
											<span>Creating Account...</span>
										</div>
									) : (
										"Create Designer Account"
									)}
								</button>
								<LoadingOverlay show={isSubmitting} />
							</>
						)}
					</div>

					{/* Form Progress */}
					<div className="flex items-center gap-2 justify-center">
						{formSections.map((section, index) => (
							<div
								key={section.id}
								className={`h-1.5 rounded-full transition-all duration-300 ${index <= formSections.findIndex(s => s.id === activeSection)
									? "w-6 md:w-8 bg-accent"
									: "w-1.5 md:w-2 bg-white/20"
									}`}
							/>
						))}
					</div>
				</div>
			</div>
		</form>
	);
};

export default DesignerSignupForm;