"use client";
import React, { useEffect, useState } from "react";
import { useFinalProducts } from "@/application/hooks/finalProduct/useFinalProduct";
import {
  ProductCard,
  LoadingCard,
} from "@/presentation/components/mainComponents/ProductCard";

interface ColorVariant {
  color: string;
  productId: string;
  mainImageUrl: string;
  otherImages: string[];
  price: number;
}

interface ProductType {
  productName: string;
  baseProductName: string;
  category: string;
  sales: number;
  designs: {
    designId: string;
    designName: string;
    designerName: string;
    position: "front" | "back";
    appliedImageUrl: string;
  }[];
  colors: ColorVariant[];
}

const ExploreSection = () => {

  // Use the custom hook with specific parameters for latest products
  const {
    products: productData,
    loading,
    error,
    fetchLatestProducts,
  } = useFinalProducts({
    shouldFetchOnMount: true,
  });

  // Handle error state
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load products: {error}
      </div>
    );
  }



  return (
    <div className="md:px-5">
      <div className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left px-5 md:px-8 lg:px-10 ">
        Latest Launch
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 gap-2 my-6 mx-2">
        {loading
          ? // Show loading placeholders
          Array(5)
            .fill(0)
            .map((_, index) => <LoadingCard key={index} />)
          : // Show actual product data
          productData.map((product, index) => (
            <ProductCard
              key={`${product.productName}-${index}`}
              category={product.category}
              colorVariants={product.colors}
              productName={product.productName}
              baseProductName={product.baseProductName}
              designs={product.designs}
            />
          ))}
      </div>
    </div>
  );
};

export default ExploreSection;
