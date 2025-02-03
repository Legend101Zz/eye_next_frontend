//@ts-nocheck
"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDesignerPhotos } from "@/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import DesignerCard from "@/components/mainComponents/DesignerCard";

const Designers = () => {
  const { designerData, loading, error, refreshData } = useDesignerPhotos();
  const { toast } = useToast();
  console.log('checking', designerData)
  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading designers",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <h2 className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left px-5 md:px-8 lg:px-10">
          Artists to follow
        </h2>
      </div>

      {/* Carousel */}
      <div className="flex justify-center gap-2 py-3 mt-5 rounded-lg w-full">
        <Carousel className="w-full">
          <CarouselContent className="px-5 gap-5 lg:gap-10">
            {loading || designerData.length === 0 ? (
              // Loading state - show multiple skeletons
              Array(5).fill(0).map((_, idx) => (
                <CarouselItem
                  key={`loading-${idx}`}
                  className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/6"
                >
                  <LoadingCard />
                </CarouselItem>
              ))
            ) : (
              // Map through designer data
              designerData.map((designer) => (
                <CarouselItem
                  key={designer._id}
                  className="pl-1 basis-auto shadow-sm"
                >
                  <DesignerCard
                    totalDesigns={designer.totalDesigns}
                    designerFollowers={designer.followers}
                    coverImageUrl={designer.coverImage?.url || ""}
                    profileImageUrl={designer.profileImage?.url || ""}
                    designerName={designer.artistName || designer.fullname}
                    designerId={designer._id}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      {/* Error state with retry button */}
      {error && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            onClick={refreshData}
            variant="secondary"
            className="rounded-full"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

const LoadingCard = () => {
  return (
    <div className="h-[22em] w-[15em] flex flex-col gap-5">
      {/* Design Image Skeleton */}
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-5">
        <div className="w-full overflow-hidden h-full">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        {/* Profile Image Skeleton */}
        <div className="overflow-hidden rounded-full w-16 h-16 absolute top-[70%] right-[35%]">
          <Skeleton className="w-full h-full rounded-full bg-accent" />
        </div>
      </div>

      {/* Text Content Skeletons */}
      <div className="max-h-full w-full flex flex-col gap-3">
        <div className="text-center">
          <Skeleton className="w-3/4 h-5 rounded-full mx-auto" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="w-20 h-4 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-fit mx-auto">
        <Skeleton className="w-24 h-9 rounded-full" />
      </div>
    </div>
  );
};

export default Designers;