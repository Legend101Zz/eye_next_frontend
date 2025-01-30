"use client"
import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { getProcessedImages } from "@/helpers/api/productApis";
import Image from "next/image";

interface ProcessedImage {
	url: string;
	filename: string;
}

interface DesignGroup {
	gender: string;
	images: {
		front: ProcessedImage[];
		back: ProcessedImage[];
	};
}

interface Product {
	productId: string;
	productName: string;
	designGroups: DesignGroup[];
}

const categories = [
	"All Categories",
	"T-Shirts",
	"Hoodies",
	"Sweatshirts",
	"Tank Tops"
];

const genders = [
	"All",
	"Male",
	"Female",
	"Unisex"
];

const SearchComponent = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Categories");
	const [selectedGender, setSelectedGender] = useState("All");
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);

	const fetchFilteredProducts = async () => {
		try {
			setIsLoading(true);
			const filters: any = {};

			if (searchQuery) {
				filters.productName = searchQuery;
			}
			if (selectedCategory !== "All Categories") {
				filters.category = selectedCategory.toLowerCase();
			}
			if (selectedGender !== "All") {
				filters.gender = selectedGender.toLowerCase();
			}

			const response = await getProcessedImages(filters);
			setSearchResults(response.data || []);
			setShowResults(true);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (searchQuery || selectedCategory !== "All Categories" || selectedGender !== "All") {
				fetchFilteredProducts();
			} else {
				setSearchResults([]);
				setShowResults(false);
			}
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [searchQuery, selectedCategory, selectedGender]);

	return (
		<div className="relative w-full max-w-3xl mx-auto">
			<div className="flex gap-2 items-center invisible md:visible">
				{/* Category Filter */}
				<Select
					value={selectedCategory}
					onValueChange={setSelectedCategory}
				>
					<SelectTrigger className="w-[140px] bg-white">
						<SelectValue>{selectedCategory}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem key={category} value={category}>
								{category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Gender Filter */}
				<Select
					value={selectedGender}
					onValueChange={setSelectedGender}
				>
					<SelectTrigger className="w-[100px] bg-white">
						<SelectValue>{selectedGender}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{genders.map((gender) => (
							<SelectItem key={gender} value={gender}>
								{gender}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Search Input */}
				<div className="flex-1 relative">
					<div className="border-2 border-black flex justify-between h-10 px-3 rounded-full">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search products..."
							className="outline-none w-full bg-transparent px-2"
						/>
						<button disabled={isLoading}>
							<span className="text-2xl hover:animate-ping">
								<IoSearchOutline />
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* Search Results Dropdown */}
			{showResults && (
				<Card className="absolute w-full mt-2 z-50 max-h-[70vh] overflow-y-auto">
					<CardContent className="p-2">
						{searchResults.length === 0 ? (
							<div className="text-center py-4 text-gray-500">
								No products found
							</div>
						) : (
							<div className="grid grid-cols-2 gap-4">
								{searchResults.map((product) => (
									<div
										key={product.productId}
										onClick={() => {
											router.push(`/product/${product.productId}`);
											setShowResults(false);
										}}
										className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
									>
										<div className="aspect-square relative mb-2">
											{product.designGroups[0]?.images?.front[0]?.url && (
												<Image
													src={product.designGroups[0].images.front[0].url}
													alt={product.productName}
													fill
													className="object-cover rounded-md"
												/>
											)}
										</div>
										<div className="font-medium truncate">{product.productName}</div>
										<div className="text-sm text-gray-500">
											{product.designGroups[0]?.gender}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default SearchComponent;