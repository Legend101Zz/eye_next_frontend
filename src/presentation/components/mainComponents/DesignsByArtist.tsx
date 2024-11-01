"use client";
import React from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/presentation/components/ui/carousel";
import { Button } from "@/presentation/components/ui/button";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useDesign } from "@/application/hooks/design/useDesign";
import DesignCard from "@/presentation/components/mainComponents/DesignCard";

type Props = {};

const DesignsByArtist = (props: Props) => {
	// Use the design hook, focusing on random designs functionality
	const {
		randomDesigns: designs,
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
			<div>
				<p className="lg:text-5xl font-heading1 text-white text-left  mt-[2em]">
					Explore Designs
				</p>
			</div>

			<div className="flex justify-center gap-2  py-3  mt-5 rounded-lg   w-full">
				<Carousel className="w-full  ">
					<CarouselContent className="px-5 gap-5 lg:gap-10">
						{loading || designs.length === 0
							? [1, 2, 3, 4, 5].map((e, idx) => {
								return (
									<div key={idx}>
										<CarouselItem className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/6  ">
											<LoadingCard />
										</CarouselItem>
									</div>
								);
							})
							: designs.map((e, index) => (
								<DesignCard
									designImageUrl={e.designImage[0].url}
									designName={e.title || "not available"}
									designerId={e.id || "not available"}
									likesCount={e.likes || 0}
									key={index}
								/>
							))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	);
};

const LoadingCard = () => {
	return (
		<>
			<div className="  h-[22em] w-[15em] flex flex-col gap-1">
				<div className=" rounded-t-lg h-[10em] w-[15em] relative mb-2">
					<div className="w-full overflow-hidden h-full">
						<Skeleton className="w-full h-full rounded-lg bg-slate-200/[0.8] " />
					</div>
				</div>
				<div className=" max-h-full w-full flex flex-col gap-3">
					<div className="text-center flex flex-col gap-2 text-xl font-heading1 pr-auto ">
						<Skeleton className="w-3/4 h-5 rounded-full  bg-white/[0.8] mr-auto" />
						<Skeleton className="w-1/4 h-5 rounded-full  bg-white/[0.8] mr-auto" />
					</div>
				</div>
			</div>
		</>
	);
};

export default DesignsByArtist;
