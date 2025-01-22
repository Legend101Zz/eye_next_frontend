"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRandomDesigns } from "@/hooks/useDesigner";
import DesignCard from "@/components/mainComponents/DesignCard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ExploreDesigns = () => {
  const { designs, loading, error, refreshDesigns } = useRandomDesigns();
  const { toast } = useToast();

  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading designs",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div>
      {/* Header */}
      <div>
        <p className="lg:text-5xl md:text-3xl text-xl font-heading1 text-white text-left lg:mt-5 mt-2 px-5 md:px-8 lg:px-10">
          Explore Designs
        </p>
      </div>

      {/* Carousel */}
      <div className="flex justify-center gap-2 py-3 mt-5 rounded-lg w-full">
        <Carousel className="w-full">
          <CarouselContent className="gap-5 lg:gap-10 px-5 md:px-8 lg:px-10">
            {loading || designs.length === 0 ? (
              // Loading state
              Array(5).fill(0).map((_, idx) => (
                <CarouselItem
                  key={`loading-${idx}`}
                  className="pl-1 basis-1/2 md:basis-1/3 xl:basis-1/6 lg:basis-1/4"
                >
                  <LoadingCard />
                </CarouselItem>
              ))
            ) : (
              // Render designs
              designs.map((design) => (
                <CarouselItem
                  key={design._id}
                  className="pl-1 basis-1/2 md:basis-1/3 xl:basis-1/6 lg:basis-1/4"
                >
                  <DesignCard
                    _id={design._id}
                    designImageUrl={design.designImage[0]?.url}
                    designName={design.title}
                    designerId={design.designerId}
                    designerName={design.designerName}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Error state with retry button */}
      {error && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            onClick={refreshDesigns}
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
    <div className="h-[22em] w-[15em] flex flex-col gap-1">
      <div className="rounded-t-lg h-[10em] w-[15em] relative mb-2">
        <div className="w-full overflow-hidden h-full">
          <Skeleton className="w-full h-full rounded-lg bg-slate-200/[0.8]" />
        </div>
      </div>
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