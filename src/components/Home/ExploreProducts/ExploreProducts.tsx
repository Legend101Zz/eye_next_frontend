"use client";
import React, { useEffect, useState } from 'react';
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
  createdAt?: string;
}

const ExploreSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFilteredProducts();
        if (response?.products) {
          // Sort by creation date (newest first) and take up to 5 products
          const sortedProducts = response.products
            .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
            .slice(0, 5);
          setProducts(sortedProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
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
    const colorVariants = firstGroup.variants.map(variant => ({
      color: variant.color,
      productId: variant.baseProductId,
      mainImageUrl: variant.images.front || '',
      otherImages: [variant.images.back || ''],
      price: firstGroup.designPrice
    }));

    return {
      category: firstGroup.variants[0]?.category || '',
      colorVariants,
      productName: product.productName,
      baseProductName: firstGroup.variants[0]?.productName || '',
      designs: firstGroup.designs.map(design => ({
        designId: design.id,
        designName: design.designName,
        designerName: design.designerName,
        position: design.position,
        appliedImageUrl: ''
      }))
    };
  };

  return (
    <div className="md:px-5">
      <div className="lg:text-5xl md:text-4xl text-3xl font-heading1 text-black text-left px-5 md:px-8 lg:px-10">
        Latest Launch
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 gap-2 my-6 mx-2">
        {loading
          ? Array(5)
            .fill(0)
            .map((_, index) => <LoadingCard key={index} />)
          : products.map((product) => {
            const formattedProduct = formatProductForCard(product);
            if (!formattedProduct) return null;
            return (
              <ProductCard
                key={product.id}
                {...formattedProduct}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ExploreSection;
