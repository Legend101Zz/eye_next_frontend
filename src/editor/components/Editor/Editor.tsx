
"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DesignsPanel } from '../DesignsPanel/DesignsPanel';
import { Toolbar } from '../Toolbar/Toolbar';
import { Canvas } from '../Canvas/Canvas';
import { ProductSelector } from '../ProductSelector/ProductSelector';
import { TransformControls } from '../TransformControls/TransformControls';
import { LayerPanel } from '../LayerPanel/LayerPanel';
import { CurvatureControls } from '../CurvatureControls/CurvatureControls';
import { PositionGuide } from '../PositionGuide/PositionGuide';
import { UndoRedoControls } from '../UndoRedoControls/UndoRedoControls';
import EditorTour from '../EditorTour/EditorTour';
import { useEditor } from "../../store/editorStore";
import { useCanvas } from '../../hooks/useCanvas';
import { ViewType } from '../../types/editor.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export const Editor: React.FC = () => {
    const [designerId, setDesignerId] = useState<string>("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const { activeView, initializeEditor } = useEditor();
    const { renderView } = useCanvas();

    // Initialize designer ID from session storage
    useEffect(() => {
        const storedDesignerId = sessionStorage.getItem("idDesigner");
        if (!storedDesignerId) {
            toast({
                title: "Error",
                description: "Designer ID not found. Please log in again.",
                variant: "destructive",
            });
            // You might want to redirect to login here
            return;
        }
        setDesignerId(storedDesignerId);
    }, []);

    // Initialize editor with designerId and designId from URL
    useEffect(() => {
        const init = async () => {
            if (!designerId) return;

            try {
                setIsLoading(true);
                const designId = searchParams.get('designId');

                await initializeEditor(designerId, designId || undefined);
                setIsInitialized(true);

                if (designId) {
                    toast({
                        title: "Design Loaded",
                        description: "Your design has been loaded successfully.",
                    });
                }
            } catch (error) {
                console.error('Error initializing editor:', error);
                toast({
                    title: "Error",
                    description: "Failed to initialize editor. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [searchParams, initializeEditor, designerId]);

    // Handle export functionality
    const handleExport = useCallback(async (view: ViewType) => {
        try {
            await renderView(view);
            const canvas = document.querySelector('canvas');
            if (!canvas) {
                throw new Error('Canvas not found');
            }
            return canvas.toDataURL('image/png') || null;
        } catch (error) {
            console.error('Error exporting view:', error);
            toast({
                title: "Export Failed",
                description: "Failed to export design. Please try again.",
                variant: "destructive",
            });
            return null;
        }
    }, [renderView]);

    // Loading state
    if (isLoading || !isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="space-y-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-lg font-medium text-muted-foreground">
                        Loading editor...
                    </p>
                </div>
            </div>
        );
    }

    // Main editor layout
    return (
        <div className="flex flex-col min-h-screen max-h-screen overflow-hidden relative">
            <EditorTour />

            <div className="flex-1 flex gap-6 p-4 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 space-y-4 overflow-y-auto">
                    <div className="flex justify-between items-center sticky top-0 bg-background z-10 pb-2">
                        <h2 className="text-lg font-semibold">Editor Tools</h2>
                        <UndoRedoControls />
                    </div>

                    <div className="space-y-4">
                        {/* Product Selector */}
                        <Card className="p-4">
                            <ProductSelector />
                        </Card>

                        {/* Upload Zone */}
                        <Card className="upload-zone p-4">
                            <Toolbar onExport={handleExport} />
                        </Card>

                        {/* Layer Panel */}
                        {/* <Card className="layer-panel p-4">
                            <LayerPanel />
                        </Card> */}

                        {/* Transform Controls */}
                        <Card className="transform-controls p-4">
                            <TransformControls />
                        </Card>

                        <Card className="p-4">
                            <CurvatureControls />
                        </Card>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full relative">
                        <Canvas />
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 overflow-y-auto">
                    <div className="space-y-4">
                        {/* <Card className="p-4">
                            <PositionGuide />
                        </Card> */}
                        <Card className="p-4">
                            <DesignsPanel />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;