import { CurvatureFilter } from "../filters/CurvatureFilter";

export type ViewType = "front" | "back" | "shoulder";
export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten";

export interface Position {
  x: number;
  y: number;
}

export interface Transform {
  position: Position;
  scale: number;
  rotation: number;
}

export interface Design {
  id: string;
  imageUrl: string;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  zIndex: number;
  name?: string;
  originalSize?: {
    width: number;
    height: number;
  };
  // New properties for curved surface mapping
  curvature?: CurvatureSettings;
}

export interface DesignsByView {
  front: Design[];
  back: Design[];
  shoulder: Design[];
  [key: string]: Design[];
}

export interface ProductType {
  id: string;
  name: string;
  category: string;
  colors: string[];
  images: {
    [key: string]: {
      // color
      [key in ViewType]?: string; // view -> image URL
    };
  };
}

export interface EditorState {
  activeView: ViewType;
  garmentColor: string;
  availableProducts: ProductType[];
  activeProductId: string | null;
  designsByView: DesignsByView;
  activeDesignId: string | null;
  designerId: string | null;
  designs: Design[];
  isDragging: boolean;
  isEditing: boolean;
  isLoading: boolean;
}

export interface CurvatureSettings {
  enabled: boolean;
  intensity: number;
  direction: "horizontal" | "vertical" | "radial" | "custom";
  perspective: number;
  waveform: "sine" | "quad" | "cubic" | "custom";
  adaptiveEdges: boolean;
  meshDensity: number;
}

declare module "fabric/fabric-impl" {
  namespace fabric {
    interface IImageFilters {
      Curvature: typeof CurvatureFilter;
    }

    interface Image {
      filters?: (IBaseFilter | CurvatureFilter)[];
    }
  }
}
