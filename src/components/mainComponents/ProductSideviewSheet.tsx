import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GrView } from "react-icons/gr";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
export function ProductSideviewSheet({
  imageUrl,
  price,
  title,
  artistName,
  colors,
  productId,
  sizes,
  category,
}: {
  imageUrl: string;
  price: string;
  title: string;
  artistName: string;
  colors: string[];
  productId: string;
  sizes: string[];
  category: string;
}) {
  const [selectedColour, setSelectedColour] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const colorMap: { [key: string]: string } = {
    blue: "bg-blue-600",
    red: "bg-red-500",
    yellow: "bg-yellow-300",
    black: "bg-black",
  };

  //doing this is necessary as we cannot do something like bg-${color}-300 as
  //tailwin generates classes dynamically and would not know exactly what class to import in the build

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="rounded-full">
          <EyeIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black text-base-content border-none">
        <SheetHeader>
          <SheetTitle className="text-white m-2 font-bold">
            {category}
          </SheetTitle>
        </SheetHeader>
        <div className="du-card du-card-compact w-3/4 ">
          <figure className="">
            <Image src={imageUrl} alt="rpod" width={1000} height={1000}></Image>
          </figure>
          <div className="du-card-body flex flex-col gap-3">
            <div className="du-card-title">{title}</div>
            <div className="text-sm text-muted-foreground">
              {"by " + artistName}
            </div>
            <div className="du-card-price text-primary">{"$" + price}</div>

            {/* colour select buttons  */}
            <div className="du-carousel bg-transparent gap-2 ">
              {colors.map((color) => {
                let outline = "border-none ";
                if (color === selectedColour) {
                  outline = " border-white border-[1px]";
                }
                return (
                  <button
                    key={color}
                    className={cn(
                      `du-carousel-item size-5 du-btn ${colorMap[color]} rounded-full   p-0 leading-none min-h-0 ${outline} `,
                    )}
                    onClick={(e) => {
                      setSelectedColour(color);
                    }}
                  ></button>
                );
              })}
            </div>

            {/* size selection  */}
            <div className="flex flex-col gap-2 ">
              <p className="justify-end">few sizes left</p>
              <div className="du-carousel bg-transparent gap-2 ">
                {sizes.map((size) => {
                  let selected = "border-none bg-white text-black";
                  if (size === selectedSize) {
                    selected = "du-btn-primary border-black";
                  }
                  return (
                    <button
                      key={size}
                      className={`du-btn du-btn-sm ${selected} border-none rounded-md md:px-5 px-3`}
                      onClick={(e) => {
                        setSelectedSize(size);
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* add to cart button  */}
            <div className="du-btn bg-white/20">Add to cart</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <SheetFooter>{/* <SheetClose asChild> */}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path
        fill-rule="evenodd"
        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};
