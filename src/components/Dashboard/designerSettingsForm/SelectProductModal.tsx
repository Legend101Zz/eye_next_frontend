import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { MdOpenInBrowser, MdAdd } from "react-icons/md";
import { ImImages } from "react-icons/im";
import { cn } from "@/lib/utils";
import ImageWithFallback from '../ImageWithFallback';
import { getDesignerDesigns } from "@/helpers/api/designerApi";
import { useRouter } from 'next/navigation';

interface Design {
	title: string;
	description: string;
	designImages: Array<{ url: string }>;
}

interface SelectProductModalProps {
	designerId: string;
	onSelect?: (selectedDesignIds: string[]) => void;
	disabled?: boolean;
	initialSelections?: string[];
}

const EmptyState = ({ onAddDesign }: { onAddDesign: () => void }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex flex-col items-center justify-center py-16 px-4 text-center"
	>
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ delay: 0.2, type: "spring" }}
			className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6"
		>
			<ImImages className="w-10 h-10 text-accent" />
		</motion.div>
		<h3 className="text-2xl font-heading1 text-white mb-3">No Designs Yet</h3>
		<p className="text-gray-400 mb-8 max-w-md">
			Start by uploading your first design to showcase your creativity to the world.
		</p>
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			<Button
				onClick={onAddDesign}
				className="bg-accent hover:bg-accent/90 text-white rounded-full px-6"
			>
				<MdAdd className="w-5 h-5 mr-2" />
				Add Your First Design
			</Button>
		</motion.div>
	</motion.div>
);

const LoadingState = () => (
	<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{Array(8).fill(null).map((_, i) => (
			<motion.div
				key={i}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: i * 0.1 }}
				className="space-y-4"
			>
				<Skeleton className="w-full aspect-square rounded-xl bg-accent/5" />
				<div className="space-y-2">
					<Skeleton className="w-3/4 h-4 bg-accent/5" />
					<Skeleton className="w-1/2 h-3 bg-accent/5" />
				</div>
			</motion.div>
		))}
	</div>
);

const DesignCard = ({
	design,
	selected,
	onSelect
}: {
	design: Design;
	selected: boolean;
	onSelect: () => void;
}) => (
	<motion.div
		layout
		whileHover={{ scale: 1.02 }}
		whileTap={{ scale: 0.98 }}
		className={cn(
			"relative group cursor-pointer overflow-hidden",
			"bg-black/20 rounded-xl backdrop-blur-sm",
			"transition-all duration-200",
			selected && "ring-2 ring-accent"
		)}
		onClick={onSelect}
	>
		<div className="aspect-square relative">
			<ImageWithFallback
				src={design.designImages[0]?.url}
				alt={design.title}
				width={400}
				height={400}
				className="object-cover rounded-t-xl"
			/>
			<motion.div
				initial={false}
				animate={{ opacity: selected ? 1 : 0 }}
				className="absolute inset-0 bg-accent/30 transition-colors"
			>
				<Checkbox
					checked={selected}
					className="absolute top-3 right-3 bg-white/20 data-[state=checked]:bg-accent"
				/>
			</motion.div>
		</div>
		<div className="p-4 space-y-1">
			<h3 className="font-medium text-white truncate">{design.title}</h3>
			<p className="text-sm text-gray-400 truncate">{design.description}</p>
		</div>
	</motion.div>
);

const SelectProductModal = ({
	designerId,
	onSelect,
	disabled,
	initialSelections = []
}: SelectProductModalProps) => {
	const [designs, setDesigns] = useState<Design[]>([]);
	const [selectedDesigns, setSelectedDesigns] = useState<string[]>(initialSelections);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchDesigns = async () => {
			try {
				setLoading(true);
				const data = await getDesignerDesigns(designerId);
				setDesigns(data.designs || []);
			} catch (error) {
				console.error('Error fetching designs:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDesigns();
	}, [designerId]);

	const handleSelect = (designId: string) => {
		setSelectedDesigns(prev =>
			prev.includes(designId)
				? prev.filter(id => id !== designId)
				: [...prev, designId]
		);
	};

	const handleSubmit = () => {
		if (onSelect) {
			onSelect(selectedDesigns);
		}
	};

	const navigateToDesignUpload = () => {
		router.push('/upload-design'); // Adjust route as needed
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="w-full gap-2 bg-black hover:bg-accent/90 text-white 
                     transition-all duration-300 transform hover:scale-[1.02]
                     border-accent/20 hover:border-accent"
					disabled={disabled}
				>
					<span>Featured Designs</span>
					<MdOpenInBrowser className="w-5 h-5" />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-4xl max-h-[85vh] bg-black backdrop-blur-xl border-accent/20">
				<DialogHeader>
					<DialogTitle className="text-2xl font-heading1 text-white">
						Featured Designs
					</DialogTitle>
					<DialogDescription className="text-gray-400">
						Choose which designs to showcase on your public profile
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-auto py-6 px-1">
					<AnimatePresence mode="wait">
						{loading ? (
							<LoadingState />
						) : designs.length === 0 ? (
							<EmptyState onAddDesign={navigateToDesignUpload} />
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
							>
								{designs.map((design, index) => (
									<DesignCard
										key={index}
										design={design}
										selected={selectedDesigns.includes(String(index))}
										onSelect={() => handleSelect(String(index))}
									/>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{designs.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex justify-between items-center pt-4 border-t border-accent/20"
					>
						<p className="text-sm text-gray-400">
							{selectedDesigns.length} design{selectedDesigns.length !== 1 && 's'} selected
						</p>
						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={() => setSelectedDesigns([])}
								className="border-accent/20 hover:border-accent text-white"
							>
								Clear All
							</Button>
							<Button
								onClick={handleSubmit}
								disabled={disabled}
								className="bg-accent hover:bg-accent/90 text-white"
							>
								Save Changes
							</Button>
						</div>
					</motion.div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default SelectProductModal;