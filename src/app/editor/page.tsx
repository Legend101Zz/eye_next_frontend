"use client";

import React from "react";
import EditorEngine from "@/presentation/components/Editor/EditorEngine";

const dummyInitialState = {
  white: {
    front: [
      {
        id: "1",
        imageUrl: "design.png",
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0,
      },
      {
        id: "2",
        imageUrl: "art.png",
        position: { x: 70, y: 60 },
        scale: 0.6,
        rotation: 15,
      },
    ],
    back: [],
  },
};

export default function EditorTestPage() {
  return (
    <div className="editor-test-page">
      <h1>Product Editor Test</h1>
      <EditorEngine
        productImageUrl="t_shirt2.png"
        initialState={dummyInitialState}
      />
    </div>
  );
}
