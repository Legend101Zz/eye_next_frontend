//@ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ProductCard, LoadingCard } from "@/components/mainComponents/ProductCard";
import { getFilteredProducts } from "@/helpers/api/productApis";

interface Design {
  id: string;
  designName: string;
  designerName: string;
  position: "front" | "back";
  scale: number;
  rotation: number;
  coordinates: {
    x: number;
    y: number;
  };
}

interface ProductVariant {
  baseProductId: string;
  productName: string;
  category: string;
  color: string;
  stock: Record<string, number>;
  images: {
    front?: string;
    back?: string;
  };
}

interface DesignGroup {
  id: string;
  name: string;
  gender: string;
  designPrice: number;
  designs: Design[];
  variants: ProductVariant[];
}

interface Product {
  id: string;
  productName: string;
  tags: string[];
  designGroups: DesignGroup[];
  isActive: boolean;
  sales: number;
}

const ExploreSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFilteredProducts();
        if (response?.products) {
          // Sort by sales to show best sellers first
          const sortedProducts = response.products.sort((a, b) => b.sales - a.sales);
          setProducts(sortedProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatProductForCard = (product: Product) => {
    // Get the first design group's variants and designs
    const firstGroup = product.designGroups[0];
    if (!firstGroup) return null;

    // Map the variants to the expected colorVariants structure
    const colorVariants = firstGroup.variants.map((variant) => ({
      color: variant.color,
      productId: variant.baseProductId,
      mainImageUrl: variant.images.front || "",
      otherImages: [variant.images.back || ""],
      price: firstGroup.designPrice,
    }));

    return {
      category: firstGroup.variants[0]?.category || "",
      colorVariants,
      productName: product.productName,
      baseProductName: firstGroup.variants[0]?.productName || "",
      designs: firstGroup.designs.map((design) => ({
        designId: design.id,
        designName: design.designName,
        designerName: design.designerName,
        position: design.position,
        appliedImageUrl: "",
      })),
    };
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="h-fit w-full">
      <div>
        <p className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left mx-auto w-fit md:mx-0">
          Latest Launch
        </p>
      </div>

      <div className="flex mt-5 flex-col justify-center  gap-3 mx-3 rounded-lg my-4 w-full ">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          // autoPlaySpeed={3000}
          keyBoardControl={true}
          showDots={false}
          containerClass="carousel-container"
          itemClass="carousel-item"
          className="z-5 w-full"
          removeArrowOnDeviceType={['tablet', 'mobile']}
        >
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => <LoadingCard key={index} />)
            : products.map((product) => {
                const formattedProduct = formatProductForCard(product);
                if (!formattedProduct) return null;
                return <ProductCard key={product.id} {...formattedProduct} />;
              })}
        </Carousel>
      </div>
    </div>
  );
};

export default ExploreSection;
