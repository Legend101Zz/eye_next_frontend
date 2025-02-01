//@ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { CurvatureFilter } from "../filters/CurvatureFilter";
import { useEditor } from "../store/editorStore";
import { ViewType, Design } from "../types/editor.types";

// Register the custom filter with fabric.js
//@ts-ignore
fabric.Image.filters.Curvature = CurvatureFilter;
// Set global CORS policy for fabric
fabric.Image.prototype.crossOrigin = "anonymous";

// Design areas for different product types
export const DESIGN_AREAS = {
  HOODIE: {
    front: {
      top: 200,
      left: 200,
      width: 200,
      height: 250,
      maxWidth: 280,
      maxHeight: 350,
    },
    back: {
      top: 200,
      left: 200,
      width: 200,
      height: 250,
      maxWidth: 280,
      maxHeight: 350,
    },
  },
  TSHIRT: {
    front: {
      top: 200,
      left: 200,
      width: 200,
      height: 250,
      maxWidth: 280,
      maxHeight: 350,
    },
    back: {
      top: 200,
      left: 200,
      width: 200,
      height: 250,
      maxWidth: 280,
      maxHeight: 350,
    },
  },
  // Add other product types as needed
};

const BLEND_MODES = {
  light: { mode: "multiply", alpha: 1 },
  dark: { mode: "screen", alpha: 0.8 },
  normal: { mode: "overlay", alpha: 0.9 },
};

export const useCanvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const mockupRef = useRef<fabric.Image | null>(null);
  const designRefsMap = useRef<Map<string, fabric.Image>>(new Map());
  const isInitializedRef = useRef(false);
  const isModifyingRef = useRef(false);

  const {
    designsByView,
    activeView,
    activeDesignId,
    activeProductId,
    availableProducts,
    garmentColor,
    updateDesignTransform,
    setActiveDesign,
  } = useEditor();

  const getBrightness = (color: string): number => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
  };

  const applyColorToMockup = async (mockup: fabric.Image, color: string) => {
    const brightness = getBrightness(color);
    const blendMode = brightness > 0.5 ? BLEND_MODES.light : BLEND_MODES.dark;

    mockup.filters = [
      new fabric.Image.filters.BlendColor({
        color,
        mode: blendMode.mode,
        alpha: blendMode.alpha,
      }),
    ];

    mockup.applyFilters();
  };

  const loadMockup = async (view: ViewType) => {
    if (!canvasRef.current || !activeProductId || !isInitializedRef.current)
      return;

    const canvas = canvasRef.current;

    // Ensure canvas is still valid
    if (!canvas.getContext()) return;

    const product = availableProducts.find((p) => p.id === activeProductId);

    if (!product || !product.images[garmentColor]?.[view]) {
      console.error("Product image not found");
      return;
    }

    try {
      const imageUrl = product.images[garmentColor][view];

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          // Check again if canvas is still valid
          if (!canvas || !isInitializedRef.current || !canvas.getContext()) {
            resolve();
            return;
          }

          try {
            // Calculate dimensions to prevent texture size issues
            let width = img.width;
            let height = img.height;
            const maxSize = 4096; // Safe maximum texture size

            if (width > maxSize || height > maxSize) {
              const ratio = Math.min(maxSize / width, maxSize / height);
              width *= ratio;
              height *= ratio;
            }

            const fabricImage = new fabric.Image(img, {
              selectable: false,
              evented: false,
              left: 0,
              top: 0,
              width: width,
              height: height,
            });

            if (mockupRef.current) {
              canvas.remove(mockupRef.current);
            }

            mockupRef.current = fabricImage;

            // Calculate scale to fit canvas
            const scaleX = canvas.width! / width;
            const scaleY = canvas.height! / height;
            const scale = Math.min(scaleX, scaleY);

            fabricImage.scale(scale);

            // Apply color and center the mockup
            // applyColorToMockup(fabricImage, garmentColor);
            fabricImage.center();

            canvas.add(fabricImage);
            canvas.sendToBack(fabricImage);
            canvas.requestRenderAll();

            // After mockup is loaded, ensure designs are visible
            setTimeout(() => {
              updateCanvasObjects();
            }, 100);

            resolve();
          } catch (error) {
            console.error("Error setting up fabric image:", error);
          }

          resolve();
        };

        img.onerror = () => {
          console.error("Error loading image:", imageUrl);
          resolve();
        };

        const corsUrl = new URL(imageUrl);
        corsUrl.searchParams.append("t", Date.now().toString());
        img.src = corsUrl.toString();
      });
    } catch (error) {
      console.error("Error loading mockup:", error);
    }
  };

  const calculateDesignScale = (designWidth: number, designHeight: number) => {
    // We want the design to be about 100px in its largest dimension
    const targetSize = 100;

    // Calculate scale based on the larger dimension
    const scale = targetSize / Math.max(designWidth, designHeight);

    return scale;
  };

  const loadDesignImage = (design: Design, canvas: fabric.Canvas) => {
    return new Promise<fabric.Image>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (!canvas) {
          reject(new Error("Canvas not available"));
          return;
        }

        try {
          // Get product category from your store
          const productType =
            availableProducts
              .find((p) => p.id === activeProductId)
              ?.category.toUpperCase() || "TSHIRT";
          const areaConstraints = DESIGN_AREAS[productType][activeView];

          // Calculate appropriate scale
          const initialScale = calculateDesignScale(img.width, img.height);

          // Calculate centered position
          const centerX = areaConstraints.left + areaConstraints.width / 2;
          const centerY = areaConstraints.top + areaConstraints.height / 2;

          const fabricImage = new fabric.Image(img, {
            left: centerX || design.transform.position.x,
            top: centerY || design.transform.position.y,
            scaleX: initialScale || 100,
            scaleY: initialScale || 100,
            angle: design.transform.rotation,
            visible: design.visible !== false,
            selectable: !design.locked,
            evented: !design.locked,
            originX: "center",
            originY: "center",
            opacity: design.opacity || 1,
          });

          resolve(fabricImage);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error, design.imageUrl);
        reject(new Error("Failed to load design image"));
      };
      // For data URLs, don't modify the URL
      if (design.imageUrl.startsWith("data:")) {
        img.src = design.imageUrl;
      } else {
        // For regular URLs, add timestamp to prevent caching
        const corsUrl = new URL(design.imageUrl);
        corsUrl.searchParams.append("t", Date.now().toString());
        img.src = corsUrl.toString();
      }
    });
  };

  const applyCurvatureToObject = (
    fabricObject: fabric.Image,
    design: Design
  ) => {
    if (!design.curvature?.enabled) {
      fabricObject.filters =
        fabricObject.filters?.filter((f) => f.type !== "Curvature") || [];
      fabricObject.applyFilters();
      return;
    }

    // Find existing curvature filter or create new one
    let curvatureFilter = fabricObject.filters?.find(
      (f) => f instanceof CurvatureFilter
    ) as CurvatureFilter;

    if (!curvatureFilter) {
      curvatureFilter = new CurvatureFilter({
        intensity: design.curvature.intensity,
        direction: design.curvature.direction,
        perspective: design.curvature.perspective,
        waveform: design.curvature.waveform,
        adaptiveEdges: design.curvature.adaptiveEdges,
        meshDensity: design.curvature.meshDensity,
      });

      // Add to filters array
      if (!fabricObject.filters) {
        fabricObject.filters = [];
      }
      fabricObject.filters.push(curvatureFilter);
    } else {
      // Update existing filter
      Object.assign(curvatureFilter, {
        intensity: design.curvature.intensity,
        direction: design.curvature.direction,
        perspective: design.curvature.perspective,
        waveform: design.curvature.waveform,
        adaptiveEdges: design.curvature.adaptiveEdges,
        meshDensity: design.curvature.meshDensity,
      });
    }

    fabricObject.applyFilters();
  };

  //  function for blend modes
  const applyBlendMode = (fabricObject: fabric.Image, design: Design) => {
    // Set opacity
    const currentOpacity = design.opacity ?? 1;

    // Apply blend mode
    const blendMode = design.blendMode || "normal";
    let compositeOperation = "source-over";

    switch (blendMode) {
      case "multiply":
        compositeOperation = "multiply";
        break;
      case "screen":
        compositeOperation = "screen";
        break;
      case "overlay":
        compositeOperation = "overlay";
        break;
      case "darken":
        compositeOperation = "darken";
        break;
      case "lighten":
        compositeOperation = "lighten";
        break;
    }

    fabricObject.set({
      globalCompositeOperation: compositeOperation,
      opacity: currentOpacity,
    });
  };

  const handleObjectModification = (obj: fabric.Image) => {
    if (!obj || isModifyingRef.current) return;

    let designId: string | null = null;
    designRefsMap.current.forEach((fabricObj, id) => {
      if (fabricObj === obj) designId = id;
    });

    if (!designId) return;

    isModifyingRef.current = true;
    try {
      updateDesignTransform(designId, {
        position: {
          x: obj.left || 0,
          y: obj.top || 0,
        },
        scale: obj.scaleX || 1,
        rotation: obj.angle || 0,
      });
    } finally {
      isModifyingRef.current = false;
    }
  };

  const setupCanvasEventHandlers = (canvas: fabric.Canvas) => {
    canvas.on("selection:created", (e) => {
      if (isModifyingRef.current) return;
      const selectedObject = e.selected?.[0];
      if (selectedObject) {
        designRefsMap.current.forEach((fabricObj, designId) => {
          if (fabricObj === selectedObject) {
            setActiveDesign(designId);
          }
        });
      }
    });

    canvas.on("selection:cleared", () => {
      if (!isModifyingRef.current) {
        setActiveDesign(null);
        canvas.renderAll();
      }
    });

    canvas.on("object:modified", (e) => {
      handleObjectModification(e.target as fabric.Image);
    });

    const handleTransform = (e: fabric.IEvent) => {
      handleObjectModification(e.target as fabric.Image);
    };

    canvas.on("object:scaling", handleTransform);
    canvas.on("object:rotating", handleTransform);
    canvas.on("object:moving", handleTransform);
  };

  const updateCanvasObjects = async () => {
    if (
      !canvasRef.current ||
      !isInitializedRef.current ||
      isModifyingRef.current
    )
      return;

    const canvas = canvasRef.current;
    const currentDesigns = designsByView[activeView];
    const sortedDesigns = [...currentDesigns].sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    );

    isModifyingRef.current = true;
    try {
      // Handle removed designs
      const activeDesignIds = new Set(currentDesigns.map((d) => d.id));
      designRefsMap.current.forEach((obj, id) => {
        if (!activeDesignIds.has(id)) {
          canvas.remove(obj);
          designRefsMap.current.delete(id);
        }
      });

      // Update/add designs
      for (const design of sortedDesigns) {
        const existingObject = designRefsMap.current.get(design.id);

        if (existingObject) {
          existingObject.set({
            left: design.transform.position.x,
            top: design.transform.position.y,
            scaleX: design.transform.scale,
            scaleY: design.transform.scale,
            angle: design.transform.rotation,
            visible: design.visible !== false,
            selectable: !design.locked,
            evented: !design.locked,
            originX: "center",
            originY: "center",
            opacity: design.opacity || 1,
          });

          applyCurvatureToObject(existingObject, design);
          applyBlendMode(existingObject, design);
          existingObject.setCoords();
          canvas.bringToFront(existingObject);
        } else {
          try {
            const fabricImage = await loadDesignImage(design, canvas);

            applyCurvatureToObject(fabricImage, design);
            applyBlendMode(fabricImage, design);
            designRefsMap.current.set(design.id, fabricImage);
            canvas.add(fabricImage);
            canvas.bringToFront(fabricImage);

            if (design.id === activeDesignId) {
              canvas.setActiveObject(fabricImage);
            }
          } catch (error) {
            console.error("Error loading design:", error);
          }
        }
      }

      canvas.requestRenderAll();
    } finally {
      isModifyingRef.current = false;
    }
  };

  const cleanupCanvas = () => {
    try {
      if (canvasRef.current && isInitializedRef.current) {
        const canvas = canvasRef.current;

        // Remove all objects first
        canvas.getObjects().forEach((obj) => {
          canvas.remove(obj);
        });

        // Clear references
        mockupRef.current = null;
        designRefsMap.current.clear();

        // Dispose canvas
        canvas.dispose();
        canvasRef.current = null;
      }
    } catch (error) {
      console.error("Error cleaning up canvas:", error);
    } finally {
      isInitializedRef.current = false;
    }
  };

  const initCanvas = (htmlCanvas: HTMLCanvasElement) => {
    if (canvasRef.current || !htmlCanvas || !htmlCanvas.getContext("2d"))
      return;

    try {
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "#00a0f5";
      fabric.Object.prototype.cornerStyle = "circle";
      fabric.Object.prototype.padding = 10;

      const canvas = new fabric.Canvas(htmlCanvas, {
        width: 500,
        height: 600,
        backgroundColor: "#f5f5f5",
        preserveObjectStacking: true,
        renderOnAddRemove: true,
      });

      canvasRef.current = canvas;
      isInitializedRef.current = true;
      setupCanvasEventHandlers(canvas);
      loadMockup(activeView);
    } catch (error) {
      console.error("Error initializing canvas:", error);
      cleanupCanvas();
    }
  };

  // Effect for product/color/view changes
  useEffect(() => {
    if (isInitializedRef.current) {
      loadMockup(activeView);
    }
  }, [activeProductId, garmentColor, activeView]);

  // Effect for design changes
  useEffect(() => {
    if (!isModifyingRef.current) {
      updateCanvasObjects();
    }
  }, [designsByView, activeView]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      cleanupCanvas();
    };
  }, []);

  return {
    initCanvas,
    renderView: async (view: ViewType) => {
      if (isInitializedRef.current) {
        await loadMockup(view);
      }
    },
    cleanupCanvas,
    canvasRef,
  };
};
