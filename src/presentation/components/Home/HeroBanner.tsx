"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/presentation/components/ui/carousel";

const HeroBanner = () => {
  return (
    <div className="w-screen h-fit relative	">
      <Carousel className="w-full  ">
        <CarouselContent className="">
          <CarouselItem>
            <Image
              src={"/bannerImage.png"}
              alt="haha"
              width={2000}
              height={2000}
              className="object-fill"
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              src={"/bannerImage.png"}
              alt="haha"
              width={2000}
              height={2000}
              className="object-fill"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroBanner;
