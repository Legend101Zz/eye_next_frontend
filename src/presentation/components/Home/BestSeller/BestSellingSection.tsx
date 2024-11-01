"use client";
import { useFinalProducts } from "@/application/hooks/finalProduct/useFinalProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/presentation/components/ui/carousel";
import {
  ProductCard,
  LoadingCard,
} from "@/presentation/components/mainComponents/ProductCard";
import { useEffect } from "react";

const BestSellingSection = () => {
  // Use the custom hook with specific parameters for latest products
  const {
    products: latestProducts,
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
    <div className="h-fit">
      <div>
        <p className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left mx-auto w-fit md:mx-0 ">
          BestSellers
        </p>
      </div>

      <div className="flex justify-center gap-2 py-3 rounded-lg shadow-sm w-full">
        <Carousel className="w-full">
          <CarouselContent className="justify-center items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 gap-2 mx-3 ">
            {loading
              ? // Show loading placeholders
              Array(5)
                .fill(0)
                .map((_, index) => <LoadingCard key={`loading-${index}`} />)
              : // Show actual product data
              latestProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  category={product.category}
                  colorVariants={product.colors.map((color) => ({
                    color: color.color,
                    productId: color.productId,
                    mainImageUrl: product.mainImageUrl, // Using main image URL from product
                    otherImages: product.otherImages,
                    price: product.price,
                  }))}
                  productName={product.productName}
                  baseProductName={product.baseProductName}
                  designs={product.designs.map((design) => ({
                    designId: "", // Add designId if available in your data
                    designName: design.designName,
                    designerName: design.designerName,
                    position: design.position,
                    appliedImageUrl: design.appliedImageUrl,
                  }))}
                />
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>


      {!loading && (
        <button
          onClick={() => fetchLatestProducts()}
          className="text-sm text-gray-500 hover:text-gray-700 mt-2"
        >
          Refresh Products
        </button>
      )}
    </div>
  );
};

export default BestSellingSection;