"use client";
import React, { useState, useEffect, useMemo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useParams } from "next/navigation";
import { GroupedProduct } from "@/domain/entities/finalProduct.entity";
import { useFinalProducts } from "@/application/hooks/finalProduct/useFinalProduct";

/**
 * Search Component
 * Provides search functionality for products with category filtering
 */
const SearchComponent = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use the final products hook with category param if available
  const {
    products,
    loading: isLoading,
    error,
    fetchProducts,
  } = useFinalProducts({
    initialParams: category ? { category: category as string } : {},
    shouldFetchOnMount: true,
  });

  // Memoized filtered results based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle category change
  useEffect(() => {
    if (category) {
      fetchProducts({ category: category as string });
    } else {
      fetchProducts({});
    }
  }, [category, fetchProducts]);

  return (
    <div className="relative overflow-hidden w-full lg:px-10 mx-auto">
      {/* Search Input */}
      <div className="border-2 border-black flex justify-between h-[2.3em] px-3 py-1 rounded-full pl-5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search Products..."
          className="outline-none w-full bg-background"
          disabled={isLoading}
        />
        <button disabled={isLoading}>
          {isLoading ? (
            <span className="text-2xl opacity-50">
              <IoSearchOutline />
            </span>
          ) : (
            <span className="text-2xl hover:animate-ping">
              <IoSearchOutline />
            </span>
          )}
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && (
        <div className="absolute bg-white w-full rounded-md border border-gray-300 shadow-md mt-3 -left-[5.5em] max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-4 text-red-500">Error: {error}</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-gray-500">No products found</div>
          ) : (
            searchResults.map((result) => (
              <SearchResultItem key={result.productId} product={result} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Search Result Item Component
 * Displays individual search result with product details
 */
const SearchResultItem = ({ product }: { product: GroupedProduct }) => {
  return (
    <div className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b">
      {/* Product Image */}
      <div className="w-12 h-12 rounded-md overflow-hidden">
        <img
          src={product.mainImageUrl}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        <h3 className="font-medium">{product.productName}</h3>
        <div className="flex gap-2 text-sm text-gray-500">
          <span>{product.category}</span>
          <span>•</span>
          <span>${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
