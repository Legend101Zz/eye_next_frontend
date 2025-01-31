"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from 'react-responsive';
const HeroBanner = () => {
  // @ts-ignore
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  console.log("size", isTabletOrMobile);
  return (
    <div className="w-full h-full mt-[3em]	">
      {/* <Carousel className="w-full  ">
        <CarouselContent className="">
          <CarouselItem> */}
      {
        isTabletOrMobile && (
          <Image
            src="/Deauth-Mobile-Hero-Banner.png"
            alt="Hero Banner"
            width={600}
            height={600}
            className="object-fill"
          />
        )
      }
      {
        isDesktopOrLaptop && (
          <Image
            src={"/bannerImage.png"}
            alt="haha"
            width={2000}
            height={2000}
            className="object-fill"
          />
        )
      }

      {/* </CarouselItem> */}
      {/* // <CarouselItem> */}
      {/* <Image
              src={"/bannerImage.png"}
              alt="haha"
              width={2000}
              height={2000}
              className="object-fill"
            /> */}
      {/* </CarouselItem>
        </CarouselContent>
      </Carousel> */}
    </div>
  );
};

export default HeroBanner;
