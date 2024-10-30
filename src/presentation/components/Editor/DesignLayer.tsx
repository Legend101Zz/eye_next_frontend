import React, { useState, useCallback, useRef, useEffect } from "react";
import { Design } from "../../types/types";

interface DesignLayerProps {
  design: Design;
  onUpdate: (updatedDesign: Design) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DesignLayer: React.FC<DesignLayerProps> = ({
  design,
  onUpdate,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = design.imageUrl;
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.style.width = `${img.width * design.scale}px`;
        imageRef.current.style.height = `${img.height * design.scale}px`;
      }
    };
  }, [design.imageUrl, design.scale]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "drag" | "resize" | "rotate") => {
      e.stopPropagation();
      if (action === "drag") setIsDragging(true);
      if (action === "resize") setIsResizing(true);
      if (action === "rotate") setIsRotating(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();

      if (isDragging) {
        const dx = ((e.clientX - dragStart.x) / container.width) * 100;
        const dy = ((e.clientY - dragStart.y) / container.height) * 100;

        onUpdate({
          ...design,
          position: {
            x: Math.max(0, Math.min(100, design.position.x + dx)),
            y: Math.max(0, Math.min(100, design.position.y + dy)),
          },
        });
      } else if (isResizing) {
        const dx = (e.clientX - dragStart.x) / container.width;
        const newScale = Math.max(0.1, design.scale + dx);
        onUpdate({ ...design, scale: newScale });
      } else if (isRotating) {
        const center = {
          x: (design.position.x / 100) * container.width,
          y: (design.position.y / 100) * container.height,
        };
        const startAngle = Math.atan2(
          dragStart.y - center.y,
          dragStart.x - center.x,
        );
        const endAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        let rotation =
          design.rotation + (endAngle - startAngle) * (180 / Math.PI);
        rotation = (rotation + 360) % 360; // Normalize to 0-360
        onUpdate({ ...design, rotation });
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [
      design,
      isDragging,
      isResizing,
      isRotating,
      dragStart,
      onUpdate,
      containerRef,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div
      ref={imageRef}
      style={{
        position: "absolute",
        left: `${design.position.x}%`,
        top: `${design.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${design.rotation}deg)`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={(e) => handleMouseDown(e, "drag")}
      onMouseMove={handleMouseMove}
    >
      <img
        src={design.imageUrl}
        alt="Design"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div className="resize-rotate-controls">
        <button
          className="resize-handle"
          style={{
            position: "absolute",
            right: "-10px",
            bottom: "-10px",
            width: "20px",
            height: "20px",
            background: "white",
            border: "1px solid black",
            borderRadius: "50%",
            cursor: "se-resize",
          }}
          onMouseDown={(e) => handleMouseDown(e, "resize")}
        />
        <button
          className="rotate-handle"
          style={{
            position: "absolute",
            left: "50%",
            top: "-20px",
            width: "20px",
            height: "20px",
            background: "white",
            border: "1px solid black",
            borderRadius: "50%",
            cursor: "grab",
            transform: "translateX(-50%)",
          }}
          onMouseDown={(e) => handleMouseDown(e, "rotate")}
        />
      </div>
    </div>
  );
};

export default React.memo(DesignLayer);
