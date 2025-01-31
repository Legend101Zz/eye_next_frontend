"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { Star, StarHalf } from 'lucide-react'

// Keep your original skeleton and side sheet imports:
import { Skeleton } from "@/components/ui/skeleton";
import { ProductSideviewSheet } from "./ProductSideviewSheet";

// Keep your types:

import {
	ColorVariant,
	UpdatedProductCardProps,
} from "@/types/types";




interface RatingProps {
	rating: number; // Rating should be a number from 0 to 5
}
// --------------------------------------------------------------------------------
// 1) LOADING CARD
// --------------------------------------------------------------------------------
export const LoadingCard = () => {
	return (
		<div className="group flex flex-col gap-5 backdrop-blur-sm overflow-hidden w-full">
			<Skeleton className="w-full h-[330px] bg-accent" />
			<div className="flex flex-col text-left gap-1">
				<Skeleton className="rounded-xl h-5 w-3/4 mr-auto bg-gray-300" />
				<Skeleton className="rounded-xl h-5 w-1/4 mr-auto bg-gray-300" />
			</div>
			<Skeleton className="rounded-xl h-5 bg-accent w-1/4 mr-auto" />
			<div className="my-2 flex flex-row justify-start">
				<Skeleton className="mr-2 size-7 bg-accent-foreground rounded-full" />
				<Skeleton className="mr-2 size-7 bg-accent-foreground rounded-full" />
				<Skeleton className="mr-2 size-7 bg-accent-foreground rounded-full" />
			</div>
		</div>
	);
};

// --------------------------------------------------------------------------------
// 2) PRODUCT CARD (ORIGINAL LOGIC + NEW UI)
// --------------------------------------------------------------------------------
export const ProductCard = ({
	productName,
	baseProductName,
	category,
	colorVariants,
	designs,
}: UpdatedProductCardProps) => {
	// If there are no colorVariants, show loading card
	if (!colorVariants || colorVariants.length === 0) {
		return <LoadingCard />;
	}

	const defaultColour = 0;
	const [selectedColorIndex, setSelectedColorIndex] = useState(defaultColour);
	const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
		colorVariants[defaultColour]
	);

	// Keep the hover image logic:
	const [image, setImage] = useState(selectedVariant.mainImageUrl);

	const handleColour = (index: number) => {
		setSelectedColorIndex(index);
		setSelectedVariant(colorVariants[index]);
		setImage(colorVariants[index].mainImageUrl);
	};

	const handleHover = () => {
		if (selectedVariant.otherImages && selectedVariant.otherImages[0]) {
			setImage(selectedVariant.otherImages[0]);
		}
	};

	const handleMouseLeave = () => {
		setImage(selectedVariant.mainImageUrl);
	};

	// If variant missing or no price, show loading
	if (!selectedVariant || !selectedVariant.price) {
		return <LoadingCard />;
	}

	const rating = 4.5;

	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	// --------------------------------------------------------------------------------
	// You can optionally define a “SizeMap” if you want different sizes at breakpoints.
	// But let’s keep it simpler for your new UI:
	// --------------------------------------------------------------------------------

	return (
		<div
			// The container style is taken from your new UI sample:
			className="
		border border-black/10	
        relative
        max-w-md
		w-[290px]
        mx-auto
        bg-white 
        rounded-lg 
        shadow-lg 
        group
        transition-transform
		font-heading1	
		tracking-wide
		
      "
		>
			{/* IMAGE WITH HOVER LOGIC */}
			<Link href="">
				<div
					className="flex mt-6 justify-center items-center p-2 "
					onMouseEnter={handleHover}
					onMouseLeave={handleMouseLeave}
				>
					<Image
						src={image}
						alt="product"
						width={190}
						height={300}
						className=" object-cover rounded-md border border-black"
					/>
				</div>
			</Link>

			{/* COLOR VARIANTS */}
			<div className="flex justify-center gap-2 mb-2">
				{colorVariants.map((variant, index) => (
					<button
						key={variant.color}
						onClick={() => handleColour(index)}
						style={{ backgroundColor: variant.color }}
						className={`
              w-6 h-6
              rounded-full
              border-2
              transition
              ${index === selectedColorIndex ? "ring-2 ring-gray-600" : ""}
            `}
					/>
				))}
			</div>
			<div className="bg-orange-100 px-2 rounded-b-lg pt-2  mt-3 ">
				{/* PRODUCT DETAILS */}
				<div className="text-left flex  justify-between mx-2 items-end  ">
					<div>
						{/* Product Name */}
						<div className="text-md md:text-md font-semibold text-black font-serif">
							{productName}
						</div>

						{/* Designer Name */}
						<div className="text-xs md:text-xs py-1 text-gray-500 mb-1">
							{designs && designs[0]?.designerName
								? designs[0].designerName
								: "Unknown Artist"}
						</div>
					</div>

					{/* Price */}
					<div className="text-3xl font-extrabold md:text-3xl text-accent transition-all duration-200">
						₹ {selectedVariant.price}
					</div>
				</div>
				<div className="flex items-end my-2 mx-1.5 ">
				<div className="flex">
					{[...Array(fullStars)].map((_, index) => (
						<Star key={`full-${index}`} className="text-black" fill="currentColor" />
					))}
					{hasHalfStar && <StarHalf className="text-black" fill="currentColor" />}
					{[...Array(emptyStars)].map((_, index) => (
						<Star key={`empty-${index}`} className="text-gray-300" />
					))}
				</div>
				{/* rating number */}
				<span>4.5 / 5</span>
				</div>

				{/* ADD TO CART BUTTON (From the new UI sample) */}
				<button className="mt-4 mb-3 w-full bg-black text-white py-2 rounded-lg text-lg hover:bg-gray-800 transition">
					Add to Cart
				</button>
			</div>
			{/* SIDE SHEET (Keep your original positioning & logic) */}
			<div className="absolute right-0 top-0">
				<ProductSideviewSheet
					category={category}
					imageUrl={image}
					title={productName}
					artistName={
						designs && designs[0]?.designerName
							? designs[0].designerName
							: "Unknown Artist"
					}
					price={selectedVariant.price.toString()}
					productId={selectedVariant.productId}
					colors={colorVariants.map((v) => v.color)}
					sizes={["M", "S"]} // Keep or adjust if needed
				/>
			</div>
		</div>
	);
};
