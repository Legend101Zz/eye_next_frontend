"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getProductDetails } from '@/helpers/api/productApis';
import { RulerIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';


const SizeGuide = () => {
	const sizeChart = {
		headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
		rows: [
			['S', '36-38', '27', '17'],
			['M', '39-41', '28', '18'],
			['L', '42-44', '29', '19'],
			['XL', '45-47', '30', '20'],
			['XXL', '48-50', '31', '21'],
		]
	};

	return (
		<div className="p-4 bg-black text-white">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b-2 border-accent">
							{sizeChart.headers.map((header) => (
								<th key={header} className="p-2 text-left font-heading1">
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sizeChart.rows.map((row, index) => (
							<tr key={index} className={index % 2 === 0 ? 'bg-white/5' : ''}>
								{row.map((cell, cellIndex) => (
									<td key={cellIndex} className="p-2">
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="mt-4 text-sm text-gray-400">
				<h4 className="font-heading1 text-accent mb-2">How to Measure</h4>
				<ul className="list-disc pl-5 space-y-1">
					<li>Chest: Measure under arms around the fullest part of chest</li>
					<li>Length: Measure from highest point of shoulder to bottom hem</li>
					<li>Shoulder: Measure from shoulder seam to shoulder seam</li>
				</ul>
			</div>
		</div>
	);
};


// Animated Logo Component
const AnimatedLogo = () => (
	<motion.div
		initial={{ scale: 0, rotate: -180 }}
		animate={{ scale: 1, rotate: 0 }}
		transition={{
			type: "spring",
			stiffness: 260,
			damping: 20
		}}
		className="fixed top-6 right-6 w-16 h-16 z-50"
	>
		<Image
			src="/deauthCircleIcon2.png"
			alt="Deauth Logo"
			width={64}
			height={64}
			className="animate-pulse"
		/>
	</motion.div>
);

// Animated Background
const AnimatedBackground = () => {
	const { scrollY } = useScroll();
	const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

	return (
		<motion.div
			className="fixed inset-0 -z-10"
			style={{ y: backgroundY }}
		>
			{/* Deauth Skull pattern */}
			<div className="absolute inset-0 opacity-[0.03] pattern-grid-lg" />

			{/* Gradient overlays */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#ff7d05,transparent_70%)] opacity-30" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#ff0060,transparent_30%)] opacity-20" />
		</motion.div>
	);
};

// Product Viewer with 3D effect
const ProductViewer = ({ images }) => {
	const [activeImage, setActiveImage] = useState(images[0]?.url);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e) => {
		const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - left) / width - 0.5;
		const y = (e.clientY - top) / height - 0.5;
		setMousePosition({ x, y });
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative aspect-square"
		>
			<motion.div
				className="relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl"
				onMouseMove={handleMouseMove}
				animate={{
					rotateX: mousePosition.y * 20,
					rotateY: mousePosition.x * 20,
				}}
				style={{ transformStyle: "preserve-3d", perspective: 1000 }}
			>
				<Image
					src={activeImage}
					alt="Product view"
					fill
					className="object-cover hover:scale-105 transition-transform duration-700"
					priority
				/>

				{/* Hover Overlay */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"
					animate={{
						opacity: Math.abs(mousePosition.x) + Math.abs(mousePosition.y),
					}}
				/>

				{/* Deauth Skull Watermark */}
				<div className="absolute bottom-4 right-4 w-16 h-16 opacity-30">
					<Image
						src="/logo.jpeg"
						alt="Deauth"
						width={64}
						height={64}
						className="animate-pulse"
					/>
				</div>
			</motion.div>

			{/* View Controls */}
			<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
				{images.map((img, index) => (
					<motion.button
						key={index}
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setActiveImage(img.url)}
						className={cn(
							"w-12 h-12 rounded-xl overflow-hidden border-2 transition-colors",
							activeImage === img.url ? "border-accent" : "border-white/20"
						)}
					>
						<Image
							src={img.url}
							alt={`View ${index + 1}`}
							width={48}
							height={48}
							className="object-cover"
						/>
					</motion.button>
				))}
			</div>
		</motion.div>
	);
};

// Floating Card component with hover effect
const FloatingCard = ({ children, delay = 0 }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay, duration: 0.5 }}
		whileHover={{ y: -5, scale: 1.02 }}
		className="bg-black/80 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-accent/50 transition-colors shadow-xl"
	>
		{children}
	</motion.div>
);

// Size Selector with animation
const SizeSelector = ({ sizes, selectedSize, onSelect }) => (
	<div className="grid grid-cols-5 gap-3">
		{Object.entries(sizes).map(([size, stock], index) => (
			<motion.button
				key={size}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				onClick={() => onSelect(size)}
				disabled={stock === 0}
				className={cn(
					"relative h-12 rounded-xl font-bold transition-all duration-300",
					selectedSize === size
						? "bg-accent text-black"
						: "bg-black/50 text-white hover:bg-black",
					stock === 0 && "opacity-50 cursor-not-allowed"
				)}
			>
				{size}
				{stock < 10 && stock > 0 && (
					<span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
						{stock}
					</span>
				)}
			</motion.button>
		))}
	</div>
);

// Color Picker with animation
const ColorPicker = ({ colors, selectedColor, onSelect }) => (
	<div className="flex gap-4">
		{colors.map((color, index) => (
			<motion.button
				key={color}
				whileHover={{ scale: 1.2, rotate: 180 }}
				whileTap={{ scale: 0.8 }}
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: index * 0.1 }}
				onClick={() => onSelect(color)}
				className={cn(
					"w-10 h-10 rounded-xl transition-transform",
					selectedColor === color && "ring-2 ring-accent ring-offset-4 ring-offset-black"
				)}
				style={{ backgroundColor: color.toLowerCase() }}
			/>
		))}
	</div>
);

// Main Product Page Component
const ProductPage = ({ params }: { params: { productId: string } }) => {
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const { toast } = useToast();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await getProductDetails(params.productId);
				setProduct(response.product);
				if (response.product?.designGroups?.length > 0) {
					setSelectedGroup(response.product.designGroups[0]);
					if (response.product.designGroups[0]?.variants?.length > 0) {
						setSelectedColor(response.product.designGroups[0].variants[0].color);
					}
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to load product details",
					variant: "destructive"
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [params.productId]);

	if (loading) {
		return (
			<div className="container mx-auto mt-24 p-4">
				<div className="grid lg:grid-cols-2 gap-12">
					<div className="animate-pulse bg-black/20 aspect-square rounded-xl" />
					<div className="space-y-4">
						<div className="h-8 bg-black/20 rounded w-3/4" />
						<div className="h-4 bg-black/20 rounded w-1/2" />
						<div className="h-4 bg-black/20 rounded w-1/4" />
					</div>
				</div>
			</div>
		);
	}

	if (!product) return null;

	const currentVariant = selectedGroup?.variants.find(v => v.color === selectedColor);


	return (
		<div className="relative min-h-screen text-white">
			<AnimatedBackground />
			<AnimatedLogo />

			<div className="container mx-auto pt-32 pb-16 px-4">
				<div className="grid lg:grid-cols-2 gap-16">
					{/* Left Column - Product Viewer */}
					<div className="space-y-8">
						<ProductViewer
							images={[
								{ url: currentVariant?.images.front, position: 'front' },
								{ url: currentVariant?.images.back, position: 'back' }
							]}
						/>

						{/* Design Details */}
						<FloatingCard delay={0.3}>
							<h3 className="text-2xl font-heading1 mb-6 flex items-center gap-2">
								<span className="text-accent">Design Details</span>
								<Image
									src="/logo.jpeg"
									alt="Deauth"
									width={24}
									height={24}
									className="opacity-50"
								/>
							</h3>

							<div className="grid sm:grid-cols-2 gap-4">
								{selectedGroup?.designs.map((design, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 + index * 0.1 }}
										className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
									>
										<h4 className="font-medium text-accent">{design.designName}</h4>
										<p className="text-sm text-gray-400">by {design.designerName}</p>
										<div className="flex gap-2 mt-2">
											<span className="text-xs px-2 py-1 bg-accent/20 rounded-lg">
												{design.position}
											</span>
											<span className="text-xs px-2 py-1 bg-white/10 rounded-lg">
												{Math.round(design.scale * 100)}%
											</span>
										</div>
									</motion.div>
								))}
							</div>
						</FloatingCard>
					</div>

					{/* Right Column - Product Details */}
					<div className="space-y-8">
						<FloatingCard>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="space-y-4"
							>
								<h1 className="text-4xl font-heading1 flex items-center gap-3">
									<span>{product.productName}</span>
									<Image
										src="/logo.jpeg"
										alt="Deauth"
										width={32}
										height={32}
										className="opacity-50"
									/>
								</h1>

								<div className="flex gap-2">
									{product.tags.map((tag, index) => (
										<motion.span
											key={tag}
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.2 + index * 0.1 }}
											className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-lg"
										>
											{tag}
										</motion.span>
									))}
								</div>

								<div className="flex justify-between items-center pt-4">
									<div>
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											className="text-4xl font-bold text-accent"
										>
											&#8377;{selectedGroup?.designPrice || 0}
										</motion.div>
										<div className="text-sm text-gray-400 mt-1">
											Including all taxes
										</div>
									</div>

									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										className="px-4 py-2 border-2 border-accent text-accent rounded-xl uppercase"
									>
										{selectedGroup?.gender}
									</motion.div>
								</div>
							</motion.div>
						</FloatingCard>

						{/* Color Selection */}
						<FloatingCard delay={0.2}>
							<h3 className="text-xl font-heading1 mb-4">Select Color</h3>
							<ColorPicker
								colors={selectedGroup?.variants.map(v => v.color) || []}
								selectedColor={selectedColor}
								onSelect={setSelectedColor}
							/>
						</FloatingCard>

						{/* Size Selection */}
						<FloatingCard delay={0.3}>
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-heading1">Select Size</h3>
								<Sheet>
									<SheetTrigger asChild>
										<Button variant="ghost" className="gap-2 text-accent">
											<RulerIcon className="w-4 h-4" />
											Size Guide
										</Button>
									</SheetTrigger>
									<SheetContent side="right" className="bg-black/95 text-white">
										<SheetHeader>
											<SheetTitle className="text-accent">Size Guide</SheetTitle>
										</SheetHeader>
										{/* Size Guide Content */}
										<SizeGuide />
									</SheetContent>
								</Sheet>
							</div>

							<SizeSelector
								sizes={currentVariant?.stock || {}}
								selectedSize={selectedSize}
								onSelect={setSelectedSize}
							/>
						</FloatingCard>

						{/* Action Buttons */}
						<div className="grid grid-cols-2 gap-4">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									size="lg"
									variant="outline"
									className="w-full gap-2 rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300"
								>
									<HeartIcon className="w-5 h-5" />
									Wishlist
								</Button>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									size="lg"
									className="w-full gap-2 rounded-xl bg-accent hover:bg-accent/90 text-black font-bold"
									disabled={!selectedSize || !selectedColor}
								>
									<ShoppingCartIcon className="w-5 h-5" />
									Add to Cart
								</Button>
							</motion.div>
						</div>

						{/* Product Features & Details */}
						<FloatingCard delay={0.4}>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								className="relative overflow-hidden"
							>
								{/* Background Skull Logo */}
								<div className="absolute -right-20 -top-20 opacity-5">
									<Image
										src="/logo.jpeg"
										alt="Deauth"
										width={200}
										height={200}
									/>
								</div>

								<div className="grid sm:grid-cols-2 gap-8 relative z-10">
									<div className="space-y-6">
										<div>
											<h4 className="text-accent mb-2">Materials</h4>
											<ul className="space-y-2 text-sm text-gray-300">
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Premium Cotton Blend
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Soft Inner Lining
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Durable Print Technology
												</li>
											</ul>
										</div>

										<div>
											<h4 className="text-accent mb-2">Product Features</h4>
											<ul className="space-y-2 text-sm text-gray-300">
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Custom Art Placement
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Double-Stitched Seams
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Ribbed Cuffs & Collar
												</li>
											</ul>
										</div>
									</div>

									<div className="space-y-6">
										<div>
											<h4 className="text-accent mb-2">Care Instructions</h4>
											<ul className="space-y-2 text-sm text-gray-300">
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Machine Wash Cold
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Tumble Dry Low
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Iron Inside Out
												</li>
											</ul>
										</div>

										<div>
											<h4 className="text-accent mb-2">Shipping & Returns</h4>
											<ul className="space-y-2 text-sm text-gray-300">
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Free Shipping Worldwide
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													30-Day Returns
												</li>
												<li className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-accent rounded-full" />
													Size Exchange Available
												</li>
											</ul>
										</div>
									</div>
								</div>

								{/* Brand Philosophy */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									className="mt-8 pt-8 border-t border-white/10"
								>
									<blockquote className="text-lg italic text-gray-400">
										"Each design tells a story, each piece a canvas for self-expression.
										Welcome to the future of street fashion."
									</blockquote>
									<div className="mt-2 text-accent text-sm">— Deauth Design Philosophy</div>
								</motion.div>
							</motion.div>
						</FloatingCard>

						{/* Social Proof Section */}
						<div className="grid grid-cols-3 gap-4">
							{[
								{ label: "Authentic Designs", value: "100%" },
								{ label: "Customer Support", value: "24/7" },
								{ label: "Easy Returns", value: "30 Days" }
							].map((item, index) => (
								<motion.div
									key={item.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 + index * 0.1 }}
									className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-black/60 transition-colors"
								>
									<div className="text-2xl font-bold text-accent">{item.value}</div>
									<div className="text-sm text-gray-400">{item.label}</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;