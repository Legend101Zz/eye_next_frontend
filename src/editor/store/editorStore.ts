"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import {
  EditorState,
  ViewType,
  Transform,
  Design,
  Position,
  DesignsByView,
  BlendMode,
  ProductType,
} from "../types/editor.types";
import {
  getClothingProducts,
  getDesignerDesigns,
  getDesignById,
  createFinalProduct,
} from "../../helpers/api/productEditorApi";

// Separate interface for actions
interface EditorActions {
  //Initialize
  initializeEditor: (designerId: string, initialDesignId?: string) => void;
  setActiveProduct: (productId: string) => void;
  // View Management
  setActiveView: (view: ViewType) => void;

  // Garment Management
  setGarmentColor: (color: string) => void;

  // Design Management
  addDesign: (design: Design) => void;
  removeDesign: (designId: string) => void;
  updateDesign: (designId: string, updates: Partial<Design>) => void;
  setActiveDesign: (designId: string | null) => void;
  updateDesignTransform: (
    designId: string,
    transform: Partial<Transform>
  ) => void;

  // Position Management
  updateDesignPosition: (designId: string, position: Position) => void;
  updateDesignScale: (designId: string, scale: number) => void;
  updateDesignRotation: (designId: string, rotation: number) => void;
  resetDesignTransform: (designId: string) => void;

  // State Management
  setIsDragging: (dragging: boolean) => void;
  setIsEditing: (editing: boolean) => void;

  // Batch Operations
  duplicateDesign: (designId: string) => void;
  clearDesigns: () => void;
  moveDesignToView: (designId: string, targetView: ViewType) => void;

  // Layer Operations

  updateDesignProperties: (
    designId: string,
    properties: Partial<Design>
  ) => void;

  reorderDesigns: (view: ViewType, newOrder: Design[]) => void;

  updateDesignZIndex: (designId: string, newIndex: number) => void;

  updateDesignBlendMode: (designId: string, blendMode: BlendMode) => void;

  updateDesignOpacity: (designId: string, opacity: number) => void;

  toggleDesignVisibility: (designId: string) => void;

  toggleDesignLock: (designId: string) => void;

  // Save Design
  addNewDesignToStore: (design: any) => void;
  addDesignToCanvas: (design: Design, view: ViewType) => void;
  createFinalProduct: (productFormData: FormData) => Promise<void>;
}

// Combine state and actions
interface EditorStore extends EditorState, EditorActions {}

const initialTransform: Transform = {
  position: { x: 0, y: 0 },
  scale: 1,
  rotation: 0,
};

const initialState: EditorState = {
  activeView: "front",
  garmentColor: "#ffffff",
  availableProducts: [],
  activeProductId: null,
  designsByView: {
    front: [],
    back: [],
    shoulder: [],
  },
  activeDesignId: null,
  designerId: null,
  designs: [],
  isDragging: false,
  isEditing: false,
  isLoading: false,
  designStateHistory: {},
};

export const useEditor = create<EditorStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Initialize editor with products and designs
      initializeEditor: async (
        designerId: string,
        initialDesignId?: string
      ) => {
        set((state) => {
          state.isLoading = true;
        });
        try {
          // Fetch available products
          const products = await getClothingProducts();
          console.log("products", products);

          // No need for images.reduce since the API already gives us the grouped format
          const formattedProducts: ProductType[] = products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            colors: p.colors,
            images: p.images, // Already in the correct format
          }));

          // Fetch designer's designs
          const designs = await getDesignerDesigns(designerId);
          console.log("designs", designs);

          // If initial design ID is provided, fetch and add it
          let initialDesign = null;
          if (initialDesignId) {
            initialDesign = await getDesignById(initialDesignId);
          }

          set((state) => {
            state.availableProducts = formattedProducts;
            state.activeProductId = formattedProducts[0]?.id || null;
            state.garmentColor = formattedProducts[0]?.colors[0] || "#ffffff";
            state.designerId = designerId;
            state.designs = designs;

            if (initialDesign) {
              state.designsByView.front.push({
                id: initialDesign._id,
                imageUrl: initialDesign.designImage[0].url,
                transform: {
                  position: { x: 300, y: 300 },
                  scale: 1,
                  rotation: 0,
                },
                visible: true,
                locked: false,
                opacity: 1,
                blendMode: "normal",
                zIndex: 0,
              });
            }
          });
        } catch (error) {
          console.error("Error initializing editor:", error);
        } finally {
          set((state) => {
            state.isLoading = false;
          });
        }
      },

      setActiveProduct: (productId: string) =>
        set((state) => {
          const prevProductId = state.activeProductId;
          const prevDesigns = state.designsByView;

          // Save current state before switching
          if (prevProductId) {
            state.designStateHistory[prevProductId] = {
              ...state.designStateHistory[prevProductId],
              ...prevDesigns,
            };
          }

          // Set new product
          state.activeProductId = productId;

          // Restore previous state for this product if it exists
          if (state.designStateHistory[productId]) {
            state.designsByView = {
              ...state.designsByView,
              ...state.designStateHistory[productId],
            };
          } else {
            // Reset to empty state for new product
            state.designsByView = {
              front: [],
              back: [],
              shoulder: [],
            };
          }

          // Update garment color if needed
          const product = state.availableProducts.find(
            (p) => p.id === productId
          );
          if (product && !product.colors.includes(state.garmentColor)) {
            state.garmentColor = product.colors[0];
          }
        }),

      // View Management
      setActiveView: (view) =>
        set((state) => {
          // Save current view state
          if (state.activeProductId) {
            state.designStateHistory[state.activeProductId] = {
              ...state.designStateHistory[state.activeProductId],
              [state.activeView]: [...state.designsByView[state.activeView]],
            };
          }

          // Update active view
          state.activeView = view;

          // Update active design
          const designs = state.designsByView[view];
          if (designs.length === 0) {
            state.activeDesignId = null;
          } else if (
            !designs.find((d) => (d.id || d._id) === state.activeDesignId)
          ) {
            state.activeDesignId = designs[0].id || designs[0]._id;
          }
        }),

      // Garment Management
      setGarmentColor: (color) =>
        set(
          (state) => {
            state.garmentColor = color;
          },
          false,
          "setGarmentColor"
        ),

      // Design Management
      addDesign: (design) =>
        set(
          (state) => {
            const designWithDefaults = {
              ...design,
              transform: design.transform || { ...initialTransform },
            };
            state.designsByView[state.activeView].push(designWithDefaults);
            state.activeDesignId = design.id;
          },
          false,
          "addDesign"
        ),

      removeDesign: (designId: string) =>
        set((state) => {
          const view = state.activeView;
          state.designsByView[view] = state.designsByView[view].filter(
            (d) => (d.id || d._id) !== designId
          );

          // Update active design if needed
          if (state.activeDesignId === designId) {
            const remainingDesigns = state.designsByView[view];
            state.activeDesignId =
              remainingDesigns.length > 0
                ? remainingDesigns[0].id || remainingDesigns[0]._id
                : null;
          }

          // Update history
          if (state.activeProductId) {
            state.designStateHistory[state.activeProductId] = {
              ...state.designStateHistory[state.activeProductId],
              [view]: [...state.designsByView[view]],
            };
          }
        }),

      updateDesign: (designId, updates) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              Object.assign(design, updates);
            }
          },
          false,
          "updateDesign"
        ),

      setActiveDesign: (designId) =>
        set(
          (state) => {
            state.activeDesignId = designId;
          },
          false,
          "setActiveDesign"
        ),

      updateDesignTransform: (designId, transform) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.transform = {
                ...design.transform,
                ...transform,
              };
            }
          },
          false,
          "updateDesignTransform"
        ),

      updateDesignPosition: (designId, position) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.transform.position = position;
            }
          },
          false,
          "updateDesignPosition"
        ),

      updateDesignScale: (designId, scale) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.transform.scale = scale;
            }
          },
          false,
          "updateDesignScale"
        ),

      updateDesignRotation: (designId, rotation) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.transform.rotation = rotation;
            }
          },
          false,
          "updateDesignRotation"
        ),

      resetDesignTransform: (designId) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.transform = { ...initialTransform };
            }
          },
          false,
          "resetDesignTransform"
        ),

      // State Management
      setIsDragging: (dragging) =>
        set(
          (state) => {
            state.isDragging = dragging;
          },
          false,
          "setIsDragging"
        ),

      setIsEditing: (editing) =>
        set(
          (state) => {
            state.isEditing = editing;
          },
          false,
          "setIsEditing"
        ),

      // Batch Operations
      duplicateDesign: (designId) =>
        set(
          (state) => {
            const designToDuplicate = state.designsByView[
              state.activeView
            ].find((d) => d.id === designId);

            if (designToDuplicate) {
              const duplicatedDesign = {
                ...designToDuplicate,
                id: nanoid(),
                transform: {
                  ...designToDuplicate.transform,
                  position: {
                    x: designToDuplicate.transform.position.x + 20,
                    y: designToDuplicate.transform.position.y + 20,
                  },
                },
              };

              state.designsByView[state.activeView].push(duplicatedDesign);
              state.activeDesignId = duplicatedDesign.id;
            }
          },
          false,
          "duplicateDesign"
        ),

      clearDesigns: () =>
        set(
          (state) => {
            state.designsByView[state.activeView] = [];
            state.activeDesignId = null;
          },
          false,
          "clearDesigns"
        ),

      moveDesignToView: (designId, targetView) =>
        set(
          (state) => {
            const sourceView = state.activeView;
            const designToMove = state.designsByView[sourceView].find(
              (d) => d.id === designId
            );

            if (designToMove) {
              // Remove from current view
              state.designsByView[sourceView] = state.designsByView[
                sourceView
              ].filter((d) => d.id !== designId);

              // Add to target view
              state.designsByView[targetView].push(designToMove);

              // Update active design if needed
              if (state.activeDesignId === designId) {
                const remainingDesigns = state.designsByView[sourceView];
                state.activeDesignId =
                  remainingDesigns.length > 0 ? remainingDesigns[0].id : null;
              }
            }
          },
          false,
          "moveDesignToView"
        ),

      updateDesignProperties: (designId, properties) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              Object.assign(design, properties);
            }
          },
          false,
          "updateDesignProperties"
        ),

      reorderDesigns: (view, newOrder) =>
        set(
          (state) => {
            state.designsByView[view] = newOrder.map((design, index) => ({
              ...design,
              zIndex: index,
            }));
          },
          false,
          "reorderDesigns"
        ),

      updateDesignZIndex: (designId, newIndex) =>
        set(
          (state) => {
            const designs = state.designsByView[state.activeView];
            const design = designs.find((d) => d.id === designId);
            if (design) {
              design.zIndex = newIndex;
              // Re-sort designs by zIndex
              state.designsByView[state.activeView].sort(
                (a, b) => a.zIndex - b.zIndex
              );
            }
          },
          false,
          "updateDesignZIndex"
        ),

      updateDesignBlendMode: (designId, blendMode) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.blendMode = blendMode;
            }
          },
          false,
          "updateDesignBlendMode"
        ),

      updateDesignOpacity: (designId, opacity) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.opacity = opacity;
            }
          },
          false,
          "updateDesignOpacity"
        ),

      toggleDesignVisibility: (designId) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.visible = !design.visible;
            }
          },
          false,
          "toggleDesignVisibility"
        ),
      toggleDesignLock: (designId) =>
        set(
          (state) => {
            const design = state.designsByView[state.activeView].find(
              (d) => d.id === designId
            );
            if (design) {
              design.locked = !design.locked;
            }
          },
          false,
          "toggleDesignLock"
        ),

      addDesignToCanvas: (design: Design, view: ViewType) =>
        set((state) => {
          const designs = state.designsByView[view];

          // Ensure unique naming
          const baseName = design.name || "Design";
          let counter = 1;
          let uniqueName = baseName;

          while (designs.some((d) => d.name === uniqueName)) {
            uniqueName = `${baseName}_${counter}`;
            counter++;
          }

          // Add design with unique name and proper positioning
          const newDesign = {
            ...design,
            name: uniqueName,
            transform: {
              ...design.transform,
              position: {
                x: design.transform.position.x + designs.length * 20,
                y: design.transform.position.y + designs.length * 20,
              },
            },
            zIndex: designs.length,
          };

          state.designsByView[view].push(newDesign);
          state.activeDesignId = design.id || design._id;

          // Update history
          if (state.activeProductId) {
            state.designStateHistory[state.activeProductId] = {
              ...state.designStateHistory[state.activeProductId],
              [view]: [...state.designsByView[view]],
            };
          }
        }),

      addNewDesignToStore: (design: any) =>
        set(
          (state) => {
            state.designs.push(design);
          },
          false,
          "addNewDesignToStore"
        ),

      createFinalProduct: async (productFormData: FormData) => {
        const state = get();
        const { activeProductId, designsByView, garmentColor } = state;

        if (!activeProductId) {
          throw new Error("No product selected");
        }

        const product = state.availableProducts.find(
          (p) => p.id === activeProductId
        );
        if (!product) {
          throw new Error("Product not found");
        }

        try {
          console.log("creatingFinal prod", productFormData);
          const response = await createFinalProduct(productFormData);
          return response;
        } catch (error) {
          console.error("Error creating final product:", error);
          throw error;
        }
      },
    }))
  )
);
