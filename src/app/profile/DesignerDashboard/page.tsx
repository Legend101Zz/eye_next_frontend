//@ts-nocheck
"use client";
import Wrapper from "@/components/Wrapper";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardIcon, ImageIcon, PlusIcon } from "@radix-ui/react-icons";
import AddDesignModal from "@/components/Dashboard/AddDesignModal";
import DashboardProductCard from "@/components/Dashboard/DashboardProductCard";
import LineChart from "@/components/Dashboard/analytics/LineChart";
import BarChart from "@/components/Dashboard/analytics/BarCharts";
import {
	getDesignerPersonalData,
	handleApiError,
	createDesign,
	getDesignerDesigns,
	type ApiError
} from "@/helpers/api/designerApi";
import SettingsSheetTest from "@/components/Dashboard/designerSettingsForm/settingsFormTest";
import { Button } from "@/components/ui/button";
import { DesignerRoute } from "@/components/auth/ProtectedRoutes/DesignerRoute";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLoading, DashboardError } from '@/components/Dashboard/DashboardLoading';

// Types
interface DesignerData {
	profileImage?: { url: string };
	coverImage?: { url: string };
	legal_first_name?: string;
	legal_last_name?: string;
	fullname: string;
	artistName: string;
	description?: string;
	socialMedia?: string[];
	phone?: string;
	portfolioLinks?: string[];
	cvLinks?: string[];
	followers?: number;
	isApproved: boolean;
}

interface ChartDataPoint {
	name: string;
	value: number;
}

interface Design {
	_id: string;
	description: string;
	title: string;
	designImage: Array<{
		url: string;
		filename: string;
	}>;
}

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut"
		}
	}
};


const EmptyDesignsState = ({ onAddDesign }: { onAddDesign: () => void }) => (
	<motion.div
		className="bg-black/90 rounded-xl p-12 text-center"
		initial={{ scale: 0.9, opacity: 0 }}
		animate={{ scale: 1, opacity: 1 }}
		transition={{ duration: 0.5 }}
	>
		<motion.div
			className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6"
			whileHover={{ scale: 1.1, rotate: 360 }}
			transition={{ duration: 0.5 }}
		>
			<ImageIcon className="w-10 h-10 text-accent" />
		</motion.div>
		<h3 className="text-2xl font-heading1 text-white mb-3">No Designs Yet</h3>
		<p className="text-gray-400 mb-6 max-w-md mx-auto">
			Start your journey by uploading your first design. Show your creativity to the world!
		</p>
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			<Button
				onClick={onAddDesign}
				className="rounded-full bg-accent text-white hover:bg-accent/90"
			>
				<PlusIcon className="w-5 h-5 mr-2" />
				Add Your First Design
			</Button>
		</motion.div>
	</motion.div>
);



const defaultChartData: ChartDataPoint[] = [
	{ name: "Jan", value: 30 },
	{ name: "Feb", value: 50 },
	{ name: "Mar", value: 70 },
];

const DesignerDashboard = () => {
	// State
	const [designerId, setDesignerId] = useState<string>("");
	const [designerData, setDesignerData] = useState<DesignerData | null>(null);
	const [designs, setDesigns] = useState<Design[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [showCharts, setShowCharts] = useState(false);
	const [isAddDesignOpen, setIsAddDesignOpen] = useState(false);
	const { toast } = useToast();



	const handleRetry = async () => {
		setLoading(true);
		setError(null);
		try {
			const profileData = await getDesignerPersonalData(designerId);
			setDesignerData(profileData);
			const designsData = await getDesignerDesigns(designerId);

			setDesigns(designsData.designs || []);
		} catch (err) {
			const handledError = handleApiError(err);
			setError(handledError);
			toast({
				variant: "destructive",
				title: "Error loading dashboard",
				description: handledError.message
			});
		} finally {
			setLoading(false);
		}
	};

	// Get designer ID from session storage on component mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedDesignerId = sessionStorage.getItem("idDesigner");
			if (storedDesignerId) {
				setDesignerId(storedDesignerId);
			}
		}
	}, []);

	// Fetch designer data when designer ID is available
	useEffect(() => {
		const fetchData = async () => {
			if (!designerId) return;

			setLoading(true);
			try {
				// Fetch designer profile data
				const profileData = await getDesignerPersonalData(designerId);
				setDesignerData(profileData);

				// Try to fetch designs, but don't break if it fails
				try {
					const designsData = await getDesignerDesigns(designerId);

					setDesigns(designsData.designs || []);
				} catch (designErr) {
					// If there's an error fetching designs, just set empty array
					console.warn("Could not load designs:", designErr);
					setDesigns([]);
					// Optionally show a toast for designs loading error
					toast({
						variant: "default",
						title: "Note",
						description: "No designs found. Start creating!"
					});
				}

			} catch (err) {
				// This error only triggers if profile data fails to load
				const handledError = handleApiError(err);
				setError(handledError);
				toast({
					variant: "destructive",
					title: "Error loading dashboard",
					description: handledError.message
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [designerId, toast]);

	const handleAddDesign = () => {
		setIsAddDesignOpen(true);
	};

	const handleDesignSubmit = async (formData: FormData) => {
		try {

			// Extract data from formData
			const title = formData.get('title') as string;
			const description = formData.get('description') as string;
			const designFile = formData.get('design') as File;

			// Extract all tags from FormData
			const tagsFromForm = formData.getAll('tags[]');
			console.log('checking', designFile, tagsFromForm)
			console.log('checking2', title, description)
			// Convert tags to strings and filter out any empty values
			const tags = tagsFromForm.length > 0
				? tagsFromForm.map(tag => tag.toString()).filter(tag => tag.trim().length > 0)
				: ['design', 'art'];

			if (!title || !designFile) {
				throw new Error('Title and design image are required');
			}

			console.log('Submitting design with tags:', tags); // Debug log

			// Create the design using the API
			await createDesign(designerId, {
				title,
				description,
				tags,
				designImage: designFile,
			});

			// Show success toast
			toast({
				title: "Success!",
				description: "Your design has been uploaded successfully.",
			});

			// Refresh designs list
			const designsData = await getDesignerDesigns(designerId);
			setDesigns(designsData.designs || []);

			// Close the modal
			setIsAddDesignOpen(false);
		} catch (error) {
			console.error('Error uploading design:', error);
			toast({
				title: "Upload Failed",
				description: error instanceof Error ? error.message : "Failed to upload design",
				variant: "destructive"
			});
			throw error; // Let the modal handle the error state
		}
	};


	if (loading) {
		return (
			<DesignerRoute>
				<DashboardLoading />
			</DesignerRoute>
		);
	}

	if (error || !designerData) {
		return (
			<DesignerRoute>
				<DashboardError
					error={error?.message || "Failed to load designer data"}
					onRetry={handleRetry}
				/>
			</DesignerRoute>
		);
	}

	return (
		<DesignerRoute>
			<div className="w-full min-h-screen bg-background">
				{/* Animated Background Hero */}
				<motion.div
					className="relative h-[300px] w-full overflow-hidden"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					<Image
						src={designerData?.coverImage?.url || "/profileCover.png"}
						alt="Profile Cover"
						fill
						className="object-cover"
						priority
					/>
					<motion.div
						className="absolute inset-0 bg-gradient-to-b from-black/70 to-background"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					/>
				</motion.div>

				<Wrapper>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{/* Profile Section */}
						<motion.div
							className="relative -mt-24 mb-16"
							variants={itemVariants}
						>
							<div className="flex flex-col md:flex-row gap-8 items-start">
								<motion.div
									className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-background"
									whileHover={{ scale: 1.05 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									<Image
										src={designerData?.profileImage?.url || "/profile.png"}
										alt="Profile"
										fill
										className="object-cover"
										priority
									/>
								</motion.div>

								<div className="flex-1 pt-4">
									<div className="flex justify-between items-start">
										<div>
											<motion.h1
												className="text-4xl font-heading1 text-black mb-2"
												variants={itemVariants}
											>
												{designerData?.artistName || designerData?.fullname || "Designer"}
											</motion.h1>
											{designerData?.description && (
												<motion.p
													className="text-gray-600 mb-4 max-w-2xl"
													variants={itemVariants}
												>
													{designerData.description}
												</motion.p>
											)}
											<motion.div
												className="flex gap-6 text-gray-500"
												variants={itemVariants}
											>
												<span>{designs.length} designs</span>
												<span>•</span>
												<span>{designerData?.followers || 0} followers</span>
											</motion.div>
										</div>

										<div className="flex gap-4">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													className="rounded-full bg-accent text-white hover:bg-accent/90"
													onClick={handleAddDesign}
												>
													<PlusIcon className="w-5 h-5 mr-2" />
													Add Design
												</Button>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<SettingsSheetTest />
											</motion.div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Stats Cards */}
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
							variants={containerVariants}
						>
							{[
								{ title: "Total Designs", value: designs.length, change: "+2 this month" },
								{ title: "Total Revenue", value: "$1,234", change: "+12% from last month" },
								{ title: "Active Orders", value: "28", change: "4 pending delivery" },
								{ title: "Avg. Rating", value: "4.8", change: "from 180 reviews" }
							].map((stat, index) => (
								<motion.div
									key={stat.title}
									className="bg-black/90 rounded-xl p-6 group cursor-pointer"
									variants={itemVariants}
									whileHover={{ scale: 1.02, y: -5 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									<h3 className="text-lg text-gray-400 mb-2">{stat.title}</h3>
									<p className="text-4xl font-heading1 text-white group-hover:text-accent transition-colors">
										{stat.value}
									</p>
									<div className="mt-2 text-sm text-gray-400">{stat.change}</div>
								</motion.div>
							))}
						</motion.div>

						{/* Analytics Section with Chart Animations */}
						<motion.div
							className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
							variants={containerVariants}
						>
							<motion.div
								className="lg:col-span-2 bg-black/90 rounded-xl p-6"
								variants={itemVariants}
							>
								<h3 className="text-xl font-heading1 text-white mb-6">Revenue Overview</h3>
								<div className="h-[300px]">
									<LineChart data={[]} />
								</div>
							</motion.div>

							<motion.div
								className="bg-black/90 rounded-xl p-6"
								variants={itemVariants}
							>
								<h3 className="text-xl font-heading1 text-white mb-6">Popular Products</h3>
								<div className="h-[300px]">
									<BarChart data={[]} />
								</div>
							</motion.div>
						</motion.div>

						{/* Designs Grid */}
						<motion.div
							className="mb-16"
							variants={containerVariants}
						>
							<motion.div
								className="flex justify-between items-center mb-8"
								variants={itemVariants}
							>
								<h2 className="text-3xl font-heading1 text-black">Your Designs</h2>
								{designs.length > 0 && (
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											variant="outline"
											className="rounded-full border-accent text-accent hover:bg-accent hover:text-white"
										>
											View All
										</Button>
									</motion.div>
								)}
							</motion.div>

							<AnimatePresence>
								{designs.length === 0 ? (
									<EmptyDesignsState onAddDesign={handleAddDesign} />
								) : (
									<motion.div
										className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
										variants={containerVariants}
									>
										{designs.map((design, index) => (
											<motion.div
												key={index}
												variants={itemVariants}
												whileHover={{ y: -5 }}
												transition={{ type: "spring", stiffness: 300 }}
											>
												<DashboardProductCard
													mainImageUrl={design.designImages[0]?.url}
													title={design.title}
													description={design.description}
													designId={design.designId}
												/>
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Load More Section */}
						{designs.length > 0 && (
							<motion.div
								className="flex flex-col items-center gap-4 pb-16"
								variants={containerVariants}
								initial="hidden"
								animate="visible"
							>
								<motion.div
									className="text-gray-500"
									variants={itemVariants}
								>
									Showing {Math.min(8, designs.length)} out of {designs.length} designs
								</motion.div>
								<motion.div
									className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden"
									variants={itemVariants}
								>
									<motion.div
										className="h-full bg-accent"
										initial={{ width: 0 }}
										animate={{ width: `${(Math.min(8, designs.length) / designs.length) * 100}%` }}
										transition={{ duration: 1, ease: "easeOut" }}
									/>
								</motion.div>
								{designs.length > 8 && (
									<motion.div
										variants={itemVariants}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button className="rounded-full bg-black text-white hover:bg-black/80">
											Load More Designs
										</Button>
									</motion.div>
								)}
							</motion.div>
						)}
					</motion.div>
				</Wrapper>
				<AddDesignModal
					isOpen={isAddDesignOpen}
					onClose={() => setIsAddDesignOpen(false)}
					onSubmit={handleDesignSubmit}
				/>
			</div>
		</DesignerRoute>
	);
};

export default DesignerDashboard;