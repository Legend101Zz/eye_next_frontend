import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { nanoid } from 'nanoid';
import { Plus, Upload, CheckCircle2 } from 'lucide-react';
import { useEditor } from "../../store/editorStore";
import AddDesignModal from './AddDesignModal';
import { toast } from "@/components/ui/use-toast";
import { createDesign } from '@/helpers/api/designerApi';

interface DesignUsage {
    id: string;
    count: number;
    views: string[];
}

export const DesignSelector = () => {

    const { designs, designsByView, activeView, addDesignToCanvas } = useEditor();
    const [designerId, setDesignerId] = useState<string>("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [designUsage, setDesignUsage] = useState<{ [key: string]: DesignUsage }>({});
    const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);


    // Get designer ID from session storage on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedDesignerId = sessionStorage.getItem("idDesigner");
            if (storedDesignerId) {
                setDesignerId(storedDesignerId);
            }
        }
    }, []);


    // Calculate design usage across all views
    useEffect(() => {
        const usage: { [key: string]: DesignUsage } = {};

        Object.entries(designsByView).forEach(([view, designList]) => {
            designList.forEach(design => {
                const originalId = design._id;
                if (!originalId) return;

                if (!usage[originalId]) {
                    usage[originalId] = { id: originalId, count: 0, views: [] };
                }
                usage[originalId].count++;
                if (!usage[originalId].views.includes(view)) {
                    usage[originalId].views.push(view);
                }
            });
        });

        setDesignUsage(usage);
    }, [designsByView]);

    const getNextAvailableName = (baseName: string) => {
        const existingNames = designsByView[activeView].map(d => d.name || '');
        if (!existingNames.includes(baseName)) return baseName;

        let counter = 1;
        while (existingNames.includes(`${baseName}_${counter}`)) {
            counter++;
        }
        return `${baseName}_${counter}`;
    };

    const handleAddDesign = (design: any) => {
        const uniqueId = nanoid();
        const name = getNextAvailableName(design.title || 'Design');

        addDesignToCanvas({
            id: uniqueId,
            _id: design._id,
            name: name,
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

        // Show success toast
        toast({
            title: "Design Added",
            description: `${name} has been added to ${activeView} view`,
        });

        // Highlight recently added design
        setRecentlyAdded(design._id);
        setTimeout(() => setRecentlyAdded(null), 2000);
    };

    const handleUploadSuccess = async (formData: FormData): Promise<void> => {
        try {

            if (!designerId) {
                throw new Error("Designer ID not found. Please ensure you're logged in.");
            }

            // Extract data from FormData
            const designData: any = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                // Convert tags array from FormData
                tags: Array.from(formData.getAll('tags[]')).map(tag => tag.toString()),
                // Get the design image file
                designImage: formData.get('design') as File,
            };

            // Call the API helper function
            await createDesign(designerId, designData);

            // Show success notification
            toast({
                title: "Design Uploaded",
                description: "Your design is now available in the selector"
            });

        } catch (error) {
            console.error('Error uploading design:', error);

            // Show error notification with appropriate message
            toast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Failed to upload design",
                variant: "destructive"
            });

            throw error;
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-medium">Your Designs</h3>
                    <p className="text-sm text-muted-foreground">Add designs to your product</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload
                </Button>
            </div>

            {!designs?.designs?.length ? (
                <div className="text-center py-8">
                    <div className="mb-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                    </div>
                    <h4 className="text-sm font-medium mb-2">No designs yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Upload your first design to get started
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Design
                    </Button>
                </div>
            ) : (
                <ScrollArea className="h-[300px]">
                    <div className="grid grid-cols-2 gap-3 pr-4">
                        {designs.designs.map((design) => {
                            const usage = designUsage[design._id];
                            const isUsed = usage && usage.count > 0;
                            const isRecent = design._id === recentlyAdded;

                            return (
                                <div
                                    key={design._id}
                                    className={`
                                        group relative rounded-lg border transition-all
                                        ${isRecent ? 'ring-2 ring-primary' : ''}
                                        ${isUsed ? 'bg-accent/5' : 'bg-background'}
                                    `}
                                >
                                    <div className="aspect-square p-2">
                                        <img
                                            src={design.designImages[0].url}
                                            alt={design.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Usage badge */}
                                    {isUsed && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-2 right-2"
                                        >
                                            Used {usage.count}×
                                        </Badge>
                                    )}

                                    {/* Add button overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddDesign(design)}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add to {activeView}
                                        </Button>
                                    </div>

                                    <div className="p-2 border-t bg-background">
                                        <p className="text-sm font-medium truncate">
                                            {design.title}
                                        </p>
                                        {isUsed && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Used in: {usage.views.join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    {isRecent && (
                                        <div className="absolute -top-2 -right-2">
                                            <CheckCircle2 className="w-6 h-6 text-primary fill-background rounded-full" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            )}

            <AddDesignModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleUploadSuccess}
            />
        </>
    );
};