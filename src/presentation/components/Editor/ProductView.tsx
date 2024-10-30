import React, { useRef, useEffect } from "react";
import { Design, ViewType } from "../../types/types";
import DesignLayer from "./DesignLayer";

interface ProductViewProps {
  productImageUrl: string;
  designs: Design[];
  currentView: ViewType;
  onDesignUpdate: (updatedDesign: Design) => void;
}

const ProductView: React.FC<ProductViewProps> = ({
  productImageUrl,
  designs,
  currentView,
  onDesignUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload images for better performance
    const imagesToPreload = [
      productImageUrl,
      ...designs.map((d) => d.imageUrl),
    ];
    imagesToPreload.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [productImageUrl, designs]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "500px", height: "500px" }}
    >
      <img
        src={productImageUrl}
        alt="Product"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {designs.map((design) => (
        <DesignLayer
          key={design.id}
          design={design}
          onUpdate={onDesignUpdate}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
};

export default React.memo(ProductView);
