"use client";
import React, { useEffect, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IoMdSettings } from "react-icons/io";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
	updateDesignerSettings,
	getDesignerSettings,
	handleApiError
} from "@/helpers/api/designerApi";
import { motion, AnimatePresence } from "framer-motion";
import FormContent from "./formContent";

interface DesignerSettings {
	isPrivate?: boolean;
	showDesigns?: boolean;
	showFollowers?: boolean;
	showFullName?: boolean;
	showPhone?: boolean;
	showDescription?: boolean;
	showCoverPhoto?: boolean;
	showProfilePhoto?: boolean;
	designIds: string[];
	socialMediaLink1?: string;
	socialMediaLink2?: string;
	portfolioLink1?: string;
	portfolioLink2?: string;
}

const defaultSettings: DesignerSettings = {
	isPrivate: false,
	showDesigns: true,
	designIds: [],
	showFollowers: true,
	showFullName: true,
	showPhone: true,
	showDescription: true,
	showProfilePhoto: true,
	socialMediaLink1: "",
	socialMediaLink2: "",
	portfolioLink1: "",
	portfolioLink2: ""
};

const SettingsSheet = () => {
	// State
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [designerId, setDesignerId] = useState<string>("");
	const [settings, setSettings] = useState<DesignerSettings>(defaultSettings);
	const { toast } = useToast();

	// Get designer ID from session storage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const id = sessionStorage.getItem("idDesigner");
			if (id) setDesignerId(id);
		}
	}, []);

	// Fetch initial settings
	useEffect(() => {
		const fetchSettings = async () => {
			if (!designerId) return;

			try {
				setLoading(true);
				const response = await getDesignerSettings(designerId);
				console.log("API Response:", response);
				const transformedSettings: DesignerSettings = {
					...defaultSettings,
					...response,
					socialMediaLink1: response.socialMediaLink1 || "",
					socialMediaLink2: response.socialMediaLink2 || "",
					portfolioLink1: response.portfolioLink1 || "",
					portfolioLink2: response.portfolioLink2 || "",
					designIds: response.designIds || []
				};

				console.log("Transformed Settings:", transformedSettings);
				setSettings(transformedSettings);
			} catch (error) {
				const handledError = handleApiError(error);
				toast({
					title: "Error loading settings",
					description: handledError.message,
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, [designerId, toast]);

	const handleSubmit = async (newSettings: DesignerSettings) => {
		if (!designerId) {
			toast({
				title: "Error",
				description: "Designer ID not found",
				variant: "destructive",
			});
			return;
		}

		try {
			setSaving(true);
			await updateDesignerSettings(designerId, newSettings);

			// Get the base URL from window.location or use a default
			const baseUrl = typeof window !== 'undefined'
				? `${window.location.protocol}//${window.location.host}`
				: 'http://localhost:3000';

			const profileUrl = `${baseUrl}/designer/${designerId}`;

			toast({
				title: "Settings updated successfully!",
				description: (
					<div className="flex flex-col gap-2 mt-2">
						<p>Your profile has been updated.</p>
						<Link
							href={profileUrl}
							className="text-accent hover:text-accent/80 transition-colors duration-200 underline"
							target="_blank"
						>
							Click here to see how your live profile looks
						</Link>
					</div>
				),
			});

			// Update local settings state
			setSettings(newSettings);
		} catch (error) {
			const handledError = handleApiError(error);
			toast({
				title: "Error saving settings",
				description: handledError.message,
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	// Rest of the component remains the same...
	return (
		<Sheet>
			<SheetTrigger asChild>
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Button className="px-4 py-2 text-white flex gap-3 items-center rounded-full
                bg-gradient-to-r from-accent via-accent to-accent/80
                hover:opacity-90 transition-all duration-300">
						<span className="font-medium">Edit Profile</span>
						<motion.div
							animate={{ rotate: [0, 180, 360] }}
							transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
						>
							<IoMdSettings className="size-5" />
						</motion.div>
					</Button>
				</motion.div>
			</SheetTrigger>

			<SheetContent
				className="bg-gradient-to-b from-black to-black/95 text-white/90 
                 border-l border-accent/20 overflow-y-auto backdrop-blur-xl"
				onInteractOutside={(e) => {
					if (saving) e.preventDefault();
				}}
			>
				<SheetHeader className="space-y-4">
					<SheetTitle className="text-2xl font-heading1 text-accent">
						Edit Profile
					</SheetTitle>
					<SheetDescription className="text-gray-400">
						Customize your profile appearance and privacy settings
					</SheetDescription>
				</SheetHeader>

				<AnimatePresence mode="wait">
					{loading ? (
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="space-y-6 py-8"
						>
							{Array(3).fill(0).map((_, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.1 }}
									className="space-y-4"
								>
									<Skeleton className="w-full h-4 bg-accent/10" />
									<Skeleton className="w-3/4 h-10 bg-accent/5" />
								</motion.div>
							))}
						</motion.div>
					) : !designerId ? (
						<motion.div
							key="error"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="py-12 text-center space-y-4"
						>
							<p className="text-red-400 font-medium">
								Please log in as a designer to edit settings
							</p>
							<Button variant="outline" className="mt-4">
								Return to Login
							</Button>
						</motion.div>
					) : (
						<motion.div
							key="form"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="relative"
						>
							<FormContent
								onSubmit={handleSubmit}
								designerId={designerId}
								initialSettings={settings}
								disabled={saving}
							/>

							{saving && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute inset-0 bg-black/50 backdrop-blur-sm
                flex items-center justify-center"
								>
									<div className="flex flex-col items-center gap-4">
										<div className="size-8 border-3 border-accent border-t-transparent
                    rounded-full animate-spin" />
										<p className="text-accent">Saving changes...</p>
									</div>
								</motion.div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</SheetContent>
		</Sheet>
	);
};

export default SettingsSheet;