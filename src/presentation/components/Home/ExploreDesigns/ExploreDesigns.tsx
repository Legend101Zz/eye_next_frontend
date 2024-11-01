"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/presentation/components/ui/carousel";
import { Skeleton } from "../../ui/skeleton";
import DesignCard from "../../mainComponents/DesignCard";
import { useDesign } from "@/application/hooks/design/useDesign";


/**
 * ExploreDesigns Component
 * Displays a carousel of random designs using the useDesign hook
 */
const ExploreDesigns = () => {
  // Use the design hook, focusing on random designs functionality
  const {
    randomDesigns,
    loading,
    error,
    fetchRandomDesigns,
  } = useDesign({
    shouldFetchOnMount: true,
  });

  // Handle error state
  if (error) {
    return (
      <div className="text-white text-center p-4 bg-red-500/10">
        Failed to load designs: {error}
      </div>
    );
  }

  return (
    <div className="">
      {/* Section Title */}
      <div>
        <p className="lg:text-5xl md:text-3xl text-xl font-heading1 text-white text-left lg:mt-5 mt-2 px-5 md:px-8 lg:px-10">
          Explore Designs
        </p>
      </div>


      <div className="flex justify-center gap-2 py-3 mt-5 rounded-lg w-full">
        <Carousel className="w-full">
          <CarouselContent className="gap-5 lg:gap-10 px-5 md:px-8 lg:px-10">
            {loading || randomDesigns.length === 0 ? (

              Array(5).fill(null).map((_, idx) => (
                <CarouselItem
                  key={`loading-${idx}`}
                  className="pl-1 basis-1/2 md:basis-1/3 xl:basis-1/6 lg:basis-1/4"
                >
                  <LoadingCard />
                </CarouselItem>
              ))
            ) : (
              // Map through and display designs
              randomDesigns.map((design) => (
                <CarouselItem
                  key={design.id}
                  className="pl-1 basis-1/2 md:basis-1/3 xl:basis-1/6 lg:basis-1/4"
                >
                  <DesignCard
                    _id={design.id}
                    designImageUrl={design.designImage[0]?.url || ''}
                    designName={design.title}
                    designerId={design.designerId}
                    likesCount={design.likes || 0}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>


      {!loading && (
        <div className="text-center mt-4">
          <button
            onClick={fetchRandomDesigns}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Discover More Designs
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * LoadingCard Component
 * Displays a skeleton loading state for design cards
 */
const LoadingCard = () => {
  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-1">
      {/* Design Image Skeleton */}
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-2">
        <div className="w-full overflow-hidden h-full">
          <Skeleton className="w-full h-full rounded-lg bg-slate-200/[0.8]" />
        </div>
      </div>
      {/* Design Info Skeleton */}
      <div className="max-h-full w-full flex flex-col gap-3">
        <div className="text-center flex flex-col gap-2 text-xl font-heading1 pr-auto">
          <Skeleton className="w-3/4 h-5 rounded-full bg-white/[0.8] mr-auto" />
          <Skeleton className="w-1/4 h-5 rounded-full bg-white/[0.8] mr-auto" />
        </div>
      </div>
    </div>
  );
};

export default ExploreDesigns;