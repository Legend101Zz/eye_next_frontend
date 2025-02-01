//@ts-nocheck
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Eye, EyeOff, Lock, Unlock, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';
import { useEditor } from '../../store/editorStore';
import { Design } from '../../types/editor.types';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface LayerItemProps {
    design: Design;
    isActive: boolean;
    onSelect: () => void;
    totalLayers: number;
    index: number;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
    design,
    isActive,
    onSelect,
    totalLayers,
    index,
    onMoveUp,
    onMoveDown
}) => {
    const { updateDesignProperties } = useEditor();

    const handlePropertyUpdate = (updates: Partial<Design>) => {
        const designId = design.id || design._id;
        updateDesignProperties(designId, {
            ...updates,
            transform: design.transform
        });
    };

    const handleVisibilityToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePropertyUpdate({ visible: !design.visible });
    };

    const handleLockToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePropertyUpdate({ locked: !design.locked });
    };

    const handleBlendModeChange = (value: string) => {
        handlePropertyUpdate({ blendMode: value });
    };

    const handleOpacityChange = (value: string) => {
        handlePropertyUpdate({ opacity: parseFloat(value) });
    };

    // Calculate layer level badge text
    const getLayerLabel = () => {
        if (index === 0) return 'Front';
        if (index === totalLayers - 1) return 'Back';
        return `Layer ${totalLayers - index}`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`
                p-4 rounded-lg border-2 mb-2 relative
                ${isActive ? 'border-primary bg-primary/5' : 'border-border'}
                hover:bg-accent/50 transition-all
                ${design.locked ? 'opacity-75' : ''}
            `}
            onClick={onSelect}
        >
            {/* Layer position indicator */}
            <Badge
                variant={index === 0 ? "default" : "secondary"}
                className="absolute -left-2 -top-2 z-10"
            >
                {getLayerLabel()}
            </Badge>

            <div className="flex items-center gap-3">
                {/* Design Preview */}
                <div className="w-16 h-16 bg-accent/10 rounded overflow-hidden shadow-sm">
                    <img
                        src={design.imageUrl}
                        alt={design.name || 'Design preview'}
                        className="w-full h-full object-contain"
                        style={{
                            opacity: design.opacity || 1,
                            mixBlendMode: design.blendMode || 'normal'
                        }}
                    />
                </div>

                {/* Layer Controls */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium truncate pr-2">
                            {design.name || 'Unnamed Design'}
                        </span>
                        <div className="flex gap-1 flex-shrink-0">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={handleVisibilityToggle}
                                        >
                                            {design.visible !== false ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {design.visible !== false ? "Hide layer" : "Show layer"}
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={handleLockToggle}
                                        >
                                            {design.locked ? (
                                                <Lock className="h-4 w-4" />
                                            ) : (
                                                <Unlock className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {design.locked ? "Unlock layer" : "Lock layer"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Blend Mode and Opacity Controls */}
                    <div className="flex gap-2">
                        <Select
                            value={design.blendMode || 'normal'}
                            onValueChange={handleBlendModeChange}
                            disabled={design.locked}
                        >
                            <SelectTrigger className="h-7 text-xs flex-1">
                                <SelectValue placeholder="Blend Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="multiply">Multiply</SelectItem>
                                <SelectItem value="screen">Screen</SelectItem>
                                <SelectItem value="overlay">Overlay</SelectItem>
                                <SelectItem value="darken">Darken</SelectItem>
                                <SelectItem value="lighten">Lighten</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={String(design.opacity || 1)}
                            onValueChange={handleOpacityChange}
                            disabled={design.locked}
                        >
                            <SelectTrigger className="h-7 text-xs w-24">
                                <SelectValue placeholder="Opacity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">100%</SelectItem>
                                <SelectItem value="0.75">75%</SelectItem>
                                <SelectItem value="0.5">50%</SelectItem>
                                <SelectItem value="0.25">25%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Layer Movement Controls */}
                    <div className="flex justify-end gap-1 pt-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={onMoveUp}
                                        disabled={index === 0 || design.locked}
                                    >
                                        <ArrowUpCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Move layer up</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={onMoveDown}
                                        disabled={index === totalLayers - 1 || design.locked}
                                    >
                                        <ArrowDownCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Move layer down</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const LayerPanel: React.FC = () => {
    const {
        designsByView,
        activeView,
        activeDesignId,
        setActiveDesign,
        reorderDesigns
    } = useEditor();

    const designs = designsByView[activeView];

    const moveLayer = (currentIndex: number, direction: 'up' | 'down') => {
        const newDesigns = [...designs];
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex >= 0 && newIndex < designs.length) {
            const [movedItem] = newDesigns.splice(currentIndex, 1);
            newDesigns.splice(newIndex, 0, movedItem);

            // Update zIndex values
            const updatedDesigns = newDesigns.map((design, index) => ({
                ...design,
                zIndex: newDesigns.length - index
            }));

            reorderDesigns(activeView, updatedDesigns);
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4" />
                <h3 className="font-medium">Layer Order</h3>
                <span className="text-xs text-primary ml-auto">
                    {designs.length} design{designs.length !== 1 ? 's' : ''}
                </span>
            </div>

            {designs.length > 0 && (
                <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Use the up/down arrows to change layer order. Top layers appear in front.
                    </AlertDescription>
                </Alert>
            )}

            <AnimatePresence mode="sync">
                {[...designs]
                    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                    .map((design, index) => (
                        <LayerItem
                            key={design.id || design._id}
                            design={design}
                            isActive={(design.id || design._id) === activeDesignId}
                            onSelect={() => setActiveDesign(design.id || design._id)}
                            totalLayers={designs.length}
                            index={index}
                            onMoveUp={() => moveLayer(index, 'up')}
                            onMoveDown={() => moveLayer(index, 'down')}
                        />
                    ))}
            </AnimatePresence>

            {designs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No designs added to this view yet.</p>
                    <p className="text-sm">Add a design to get started</p>
                </div>
            )}
        </Card>
    );
};

export default LayerPanel;