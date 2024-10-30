import React, { useState, useCallback, useMemo } from "react";
import ProductView from "./ProductView";
import ToolBar from "./ToolBar";
import ColorSelector from "./ColorSelector";
import ViewSelector from "./ViewSelector";
import { ProductState, ViewType, Design } from "../../types/types";

interface EditorEngineProps {
  productImageUrl: string;
  initialState?: ProductState;
}

const EditorEngine: React.FC<EditorEngineProps> = ({
  productImageUrl,
  initialState = {},
}) => {
  const [productState, setProductState] = useState<ProductState>(initialState);
  const [currentColor, setCurrentColor] = useState<string>("white");
  const [currentView, setCurrentView] = useState<ViewType>("front");

  const currentDesigns = useMemo(
    () => productState[currentColor]?.[currentView] || [],
    [productState, currentColor, currentView],
  );

  const handleDesignUpdate = useCallback(
    (updatedDesign: Design) => {
      setProductState((prevState) => ({
        ...prevState,
        [currentColor]: {
          ...prevState[currentColor],
          [currentView]:
            prevState[currentColor]?.[currentView]?.map((design) =>
              design.id === updatedDesign.id ? updatedDesign : design,
            ) || [],
        },
      }));
    },
    [currentColor, currentView],
  );

  const handleAddDesign = useCallback(
    (newDesign: Omit<Design, "id">) => {
      const design: Design = {
        ...newDesign,
        id: Date.now().toString(),
      };
      setProductState((prevState) => ({
        ...prevState,
        [currentColor]: {
          ...prevState[currentColor],
          [currentView]: [
            ...(prevState[currentColor]?.[currentView] || []),
            design,
          ],
        },
      }));
    },
    [currentColor, currentView],
  );

  return (
    <div className="editor-engine">
      <ProductView
        productImageUrl={productImageUrl}
        designs={currentDesigns}
        currentView={currentView}
        onDesignUpdate={handleDesignUpdate}
      />
      <ToolBar onAddDesign={handleAddDesign} />
      <ColorSelector
        currentColor={currentColor}
        onColorChange={setCurrentColor}
      />
      <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default EditorEngine;
