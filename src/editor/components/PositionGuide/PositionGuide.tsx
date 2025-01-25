//@ts-nocheck
import React, { useEffect, useState, memo } from 'react';
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useEditor } from '../../store/editorStore';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const SAFE_AREA_MARGIN = 20;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;

interface DesignPosition {
    id: string;
    position: { x: number; y: number };
    isOutOfBounds: boolean;
    name: string;
}

// Enhanced design area calculation
const getDesignArea = (productType: string, view: string) => {
    const safeArea = {
        top: CANVAS_HEIGHT * 0.2,
        left: CANVAS_WIDTH * 0.2,
        width: CANVAS_WIDTH * 0.6,
        height: CANVAS_HEIGHT * 0.5,
        maxWidth: CANVAS_WIDTH * 0.7,
        maxHeight: CANVAS_HEIGHT * 0.6
    };

    return safeArea;
};

// Memoized design indicator component
const DesignIndicator = memo(({ design, activeDesignId }: {
    design: DesignPosition;
    activeDesignId: string | null;
}) => (
    <TooltipProvider key={design.id}>
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <div
                    className={`
                        absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 
                        rounded-full transition-all cursor-pointer
                        ${design.isOutOfBounds ? 'bg-red-500' : 'bg-blue-500'}
                        ${design.id === activeDesignId ? 'ring-2 ring-white shadow-lg scale-125' : 'opacity-60'}
                        hover:opacity-100
                    `}
                    style={{
                        top: `${(design.position.y / CANVAS_HEIGHT) * 100}%`,
                        left: `${(design.position.x / CANVAS_WIDTH) * 100}%`,
                        zIndex: design.id === activeDesignId ? 10 : 1
                    }}
                >
                    <span className="sr-only">{design.name}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
                <div className="text-xs">
                    <p className="font-medium">{design.name}</p>
                    <p>X: {Math.round(design.position.x)}px</p>
                    <p>Y: {Math.round(design.position.y)}px</p>
                    {design.isOutOfBounds && (
                        <p className="text-red-500">⚠️ Outside safe area</p>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
));

DesignIndicator.displayName = 'DesignIndicator';

export const PositionGuide: React.FC = () => {
    const {
        activeView,
        activeProductId,
        availableProducts,
        designsByView,
        activeDesignId
    } = useEditor();

    const [designPositions, setDesignPositions] = useState<DesignPosition[]>([]);

    const activeProduct = availableProducts.find(p => p.id === activeProductId);
    const productType = activeProduct?.category || 'TSHIRT';
    const safeArea = getDesignArea(productType, activeView);

    const isOutOfBounds = (pos: { x: number, y: number }) => {
        return pos.x < (safeArea.left - SAFE_AREA_MARGIN) ||
            pos.x > (safeArea.left + safeArea.width + SAFE_AREA_MARGIN) ||
            pos.y < (safeArea.top - SAFE_AREA_MARGIN) ||
            pos.y > (safeArea.top + safeArea.height + SAFE_AREA_MARGIN);
    };

    useEffect(() => {
        const designs = designsByView[activeView];
        if (!designs) return;

        const newPositions = designs.map(design => ({
            id: design.id || design._id,
            position: design.transform.position,
            isOutOfBounds: isOutOfBounds(design.transform.position),
            name: design.name || `Design ${designs.indexOf(design) + 1}`
        }));

        setDesignPositions(newPositions);
    }, [designsByView, activeView, safeArea.left, safeArea.top, safeArea.width, safeArea.height]);

    const outOfBoundsCount = designPositions.filter(d => d.isOutOfBounds).length;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Position Guide</h3>
                <span className="text-xs text-muted-foreground">
                    {designPositions.length} design{designPositions.length !== 1 ? 's' : ''}
                </span>
            </div>

            <Card className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                {/* Safe area rectangle */}
                <div
                    className="absolute border-2 border-dashed border-blue-400/50"
                    style={{
                        top: `${(safeArea.top / CANVAS_HEIGHT) * 100}%`,
                        left: `${(safeArea.left / CANVAS_WIDTH) * 100}%`,
                        width: `${(safeArea.width / CANVAS_WIDTH) * 100}%`,
                        height: `${(safeArea.height / CANVAS_HEIGHT) * 100}%`
                    }}
                />

                {/* Design position indicators */}
                {designPositions.map(design => (
                    <DesignIndicator
                        key={design.id}
                        design={design}
                        activeDesignId={activeDesignId}
                    />
                ))}

                {/* View label */}
                <div className="absolute bottom-2 left-2 text-xs text-gray-500 capitalize">
                    {activeView} view
                </div>
            </Card>

            {/* Warnings */}
            {outOfBoundsCount > 0 && (
                <Alert variant="warning" className="py-2">
                    <div className="text-xs">
                        {outOfBoundsCount} design{outOfBoundsCount !== 1 ? 's' : ''} outside safe area
                    </div>
                </Alert>
            )}
        </div>
    );
};

export default memo(PositionGuide);