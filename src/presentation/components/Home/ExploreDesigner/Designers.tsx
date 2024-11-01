"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/presentation/components/ui/carousel";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import DesignerCard from "@/presentation/components/mainComponents/DesignerCard";
import { useAuth } from "@/application/hooks/auth/useAuth";
import { useRandomDesigners } from "@/application/hooks/designer/useDesigner";

interface DesignerCardProps {
  totalDesigns: number;
  designerFollowers: number;
  designImageUrl: string;
  designName: string;
  designerId: string;
  designerName: string;
  profileImageUrl: string;
}

const Designers = () => {
  // Get current user context for follow functionality
  const { user } = useAuth();

  // Use the custom hook for random designers
  const {
    designers,
    loading,
    error,
    refreshDesigners
  } = useRandomDesigners();

  // Handle error state with user feedback
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load designers: {error}
      </div>
    );
  }

  return (
    <>
      {/* Section Header */}
      <div>
        <p className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left px-5 md:px-8 lg:px-10 ">
          Artists to follow
        </p>
      </div>

      {/* Carousel Section */}
      <div className="flex justify-center gap-2 py-3 mt-5 rounded-lg w-full">
        <Carousel className="w-full">
          <CarouselContent className="px-5 gap-5 lg:gap-10">
            {/* Show loading skeletons or designer cards based on loading state */}
            {loading || designers.length === 0 ? (
              // Display multiple loading cards while fetching
              Array(5).fill(0).map((_, index) => (
                <CarouselItem
                  key={`loading-${index}`}
                  className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <LoadingCard />
                </CarouselItem>
              ))
            ) : (
              // Map through designers and display cards
              designers.map((designer) => (
                <CarouselItem
                  key={designer.designerId}
                  className="pl-1 basis-auto shadow-sm"
                >
                  <DesignerCard
                    totalDesigns={designer.totalDesigns}
                    designerFollowers={designer.designerFollowers}
                    designImageUrl={designer.designImage || ""}
                    designName={designer.designName}
                    designerId={designer.designerId}
                    designerName={designer.designerName}
                    profileImageUrl={designer.profileImage || ""}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {/* Carousel Navigation */}
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Optional: Refresh button for manual update */}
      {!loading && (
        <div className="text-center mt-4">
          <Button
            onClick={refreshDesigners}
            variant="ghost"
            className="text-sm hover:text-accent"
          >
            Refresh Artists
          </Button>
        </div>
      )}
    </>
  );
};

/**
 * Loading card skeleton component
 * Displays a placeholder while designer data is being fetched
 */
const LoadingCard = () => {
  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-5">
      {/* Design Image Skeleton */}
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-5">
        <div className="w-full overflow-hidden h-full">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        {/* Profile Picture Skeleton */}
        <div className="overflow-hidden rounded-full w-16 h-16 absolute top-[70%] right-[35%]">
          <Skeleton className="w-full h-full rounded-lg bg-accent" />
        </div>
      </div>

      {/* Designer Name Skeleton */}
      <div className="max-h-full w-full flex flex-col gap-3">
        <div className="text-center text-xl font-heading1">
          <Skeleton className="w-3/4 h-5 rounded-full mx-auto" />
        </div>
      </div>

      {/* Follow Button Skeleton */}
      <div className="w-fit mx-auto">
        <Skeleton className="w-24 h-10 rounded-full" />
      </div>
    </div>
  );
};

export default Designers;