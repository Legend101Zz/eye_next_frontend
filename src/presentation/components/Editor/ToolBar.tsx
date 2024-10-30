import React from "react";
import { Design } from "../../types/types";

interface ToolBarProps {
  onAddDesign: (newDesign: Omit<Design, "id">) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ onAddDesign }) => {
  const handleAddDesign = () => {
    onAddDesign({
      imageUrl: "profile.png",
      position: { x: 50, y: 50 },
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <div className="toolbar">
      <button onClick={handleAddDesign}>Add Design</button>
    </div>
  );
};

export default ToolBar;
