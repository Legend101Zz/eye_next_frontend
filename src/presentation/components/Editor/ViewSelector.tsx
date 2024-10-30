import React from "react";
import { ViewType } from "../../types/types";

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="view-selector">
      <button
        onClick={() => onViewChange("front")}
        style={{ fontWeight: currentView === "front" ? "bold" : "normal" }}
      >
        Front
      </button>
      <button
        onClick={() => onViewChange("back")}
        style={{ fontWeight: currentView === "back" ? "bold" : "normal" }}
      >
        Back
      </button>
    </div>
  );
};

export default ViewSelector;
