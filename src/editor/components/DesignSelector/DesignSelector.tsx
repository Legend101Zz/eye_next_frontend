import React, { useState, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { nanoid } from 'nanoid';
import { Plus, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from "../../store/editorStore";
import AddDesignModal from './AddDesignModal';
import { toast } from "@/components/ui/use-toast";
import { createDesign } from '@/helpers/api/designerApi';
import { getDesignerDesigns } from '@/helpers/api/productEditorApi';

interface DesignUsage {
    id: string;
    usageCount: number;
    addedToCanvas: boolean;
    views: string[];
}

const DesignCard = ({
    design,
    usageInfo,
    onAdd,
    isRecent,
    variant = 'available'
}) => {
    const usageCount = usageInfo?.usageCount || 0;
    const isAdded = variant === 'added';
    const usedInViews = usageInfo?.views || [];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
                duration: 0.3,
                layout: { duration: 0.3 }
            }}
            className={`
                group relative rounded-lg border-2 transition-all
                ${isRecent ? 'ring-2 ring-primary' : ''}
                ${isAdded ? 'border-emerald-500/20' : 'border-border'}
            `}
        >
            <div className="aspect-square p-2 relative">
                <img
                    src={design.designImages[0].url}
                    alt={design.title}
                    className="w-full h-full object-contain"
                />

                {usageCount > 0 && (
                    <Badge
                        variant="secondary"
                        className={`absolute top-2 right-2 ${isAdded ? 'bg-emerald-500' : 'bg-muted'
                            } text-white`}
                    >
                        Used {usageCount}×
                    </Badge>
                )}

                <div className="absolute -top-3 -right-3">
                    {isAdded ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-white" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500 fill-white" />
                    )}
                </div>
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <Button
                    size="sm"
                    onClick={() => onAdd(design)}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {isAdded ? 'Add Again' : 'Add to Canvas'}
                </Button>
            </div>

            <div className="p-2 border-t bg-background/95">
                <p className="text-sm font-medium truncate">
                    {design.title}
                </p>
                {usageCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Used in: {usedInViews.join(', ')}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export const DesignSelector = () => {
    const { designs: apiDesigns, designsByView, activeView, addDesignToCanvas } = useEditor();
    const [designerId, setDesignerId] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [designUsage, setDesignUsage] = useState<Record<string, DesignUsage>>({});
    const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
    const [localDesigns, setLocalDesigns] = useState<any[]>([]);

    // Get designer ID from session storage
    useEffect(() => {
        const storedDesignerId = sessionStorage.getItem("idDesigner");
        if (storedDesignerId) {
            setDesignerId(storedDesignerId);
        }
    }, []);

    // Track design usage across all views
    useEffect(() => {
        const newUsage: Record<string, DesignUsage> = {};

        Object.entries(designsByView).forEach(([view, designList]) => {
            designList.forEach(design => {
                const originalId = design._id;
                if (!originalId) return;

                if (!newUsage[originalId]) {
                    newUsage[originalId] = {
                        id: originalId,
                        usageCount: 1,
                        addedToCanvas: true,
                        views: [view]
                    };
                } else {
                    newUsage[originalId].usageCount++;
                    if (!newUsage[originalId].views.includes(view)) {
                        newUsage[originalId].views.push(view);
                    }
                }
            });
        });

        setDesignUsage(newUsage);
    }, [designsByView]);

    // Initialize and update local designs
    useEffect(() => {
        if (apiDesigns?.designs) {
            setLocalDesigns(apiDesigns.designs);
        }
    }, [apiDesigns]);

    const revalidateDesigns = useCallback(async () => {
        if (!designerId) return;

        try {
            const latestDesigns = await getDesignerDesigns(designerId);
            if (latestDesigns?.designs) {
                setLocalDesigns(latestDesigns.designs);
            }
        } catch (error) {
            console.error('Error fetching latest designs:', error);
        }
    }, [designerId]);

    const handleAddDesign = (design: any) => {
        const uniqueId = nanoid();
        const usageInfo = designUsage[design._id];
        const name = `${design.title || 'Design'} ${usageInfo ? usageInfo.usageCount + 1 : 1}`;

        addDesignToCanvas({
            id: uniqueId,
            _id: design._id,
            name,
            imageUrl: design.designImages[0].url,
            transform: {
                position: {
                    x: 300 + (designsByView[activeView].length * 20),
                    y: 300 + (designsByView[activeView].length * 20)
                },
                scale: 1,
                rotation: 0
            },
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: "normal",
            zIndex: designsByView[activeView].length
        }, activeView);

        setRecentlyAdded(design._id);
        setTimeout(() => setRecentlyAdded(null), 2000);

        toast({
            title: "Design Added",
            description: `${name} has been added to the canvas`,
        });
    };

    const handleUploadSuccess = async (formData: FormData): Promise<void> => {
        try {
            if (!designerId) {
                throw new Error("Designer ID not found. Please ensure you're logged in.");
            }

            const designData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                tags: Array.from(formData.getAll('tags[]')).map(tag => tag.toString()),
                designImage: formData.get('design') as File,
            };

            const response = await createDesign(designerId, designData);

            if (response.success && response.design) {
                setLocalDesigns(prev => [...prev, response.design]);

                toast({
                    title: "Design Uploaded",
                    description: "Your design has been uploaded successfully"
                });

                setRecentlyAdded(response.design._id);
                setTimeout(() => setRecentlyAdded(null), 2000);
            }

            setIsUploadModalOpen(false);
            revalidateDesigns(); // Refresh the designs list

        } catch (error) {
            console.error('Error uploading design:', error);
            toast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Failed to upload design",
                variant: "destructive"
            });
            throw error;
        }
    };

    if (!localDesigns.length) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                </div>
                <h4 className="text-sm font-medium mb-2">No designs available</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Upload your first design to get started
                </p>
                <Button
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Upload Design
                </Button>
            </div>
        );
    }

    const addedDesigns = localDesigns.filter(d => designUsage[d._id]?.addedToCanvas);
    const availableDesigns = localDesigns.filter(d => !designUsage[d._id]?.addedToCanvas);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-medium">Design Library</h3>
                    <p className="text-sm text-muted-foreground">
                        {addedDesigns.length} used / {localDesigns.length} total designs
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload New
                </Button>
            </div>

            <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4">
                    <AnimatePresence mode="popLayout">
                        {/* Added Designs Section */}
                        {addedDesigns.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Used Designs ({addedDesigns.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {addedDesigns.map((design) => (
                                        <DesignCard
                                            key={`${design._id}-added`}
                                            design={design}
                                            usageInfo={designUsage[design._id]}
                                            onAdd={handleAddDesign}
                                            isRecent={design._id === recentlyAdded}
                                            variant="added"
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Available Designs Section */}
                        {availableDesigns.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {addedDesigns.length > 0 && <Separator className="my-6" />}
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    Available Designs ({availableDesigns.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableDesigns.map((design) => (
                                        <DesignCard
                                            key={`${design._id}-available`}
                                            design={design}
                                            usageInfo={designUsage[design._id]}
                                            onAdd={handleAddDesign}
                                            isRecent={design._id === recentlyAdded}
                                            variant="available"
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            <AddDesignModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleUploadSuccess}
            />
        </>
    );
};