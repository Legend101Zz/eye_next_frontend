import React from "react";

interface ColorSelectorProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  currentColor,
  onColorChange,
}) => {
  const colors = ["white", "black", "red", "blue"];

  return (
    <div className="color-selector">
      {colors.map((color) => (
        <button
          key={color}
          style={{
            backgroundColor: color,
            border: color === currentColor ? "2px solid gold" : "none",
            width: "30px",
            height: "30px",
            margin: "5px",
          }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
