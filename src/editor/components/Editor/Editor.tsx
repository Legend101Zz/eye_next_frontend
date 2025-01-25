//@ts-nocheck
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
import { DesignSelector } from '../DesignSelector/DesignSelector';
import { SaveProduct } from '../SaveProduct/SaveProduct';
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GripVertical } from 'lucide-react';


const MIN_SIDEBAR_WIDTH = 300;
const MAX_SIDEBAR_WIDTH = 600;
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 py-2">
        <h3 className="text-sm font-semibold tracking-tight">{children}</h3>
        <Separator className="flex-1" />
    </div>
);

const ResizablePanel = ({ children, side, width, setWidth }: {
    children: React.ReactNode;
    side: 'left' | 'right';
    width: number;
    setWidth: (width: number) => void;
}) => {
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            let newWidth;
            if (side === 'left') {
                newWidth = e.clientX;
            } else {
                newWidth = window.innerWidth - e.clientX;
            }

            // Constrain width
            newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth));
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, setWidth, side]);

    return (
        <div
            className="flex-none relative bg-background rounded-lg shadow-sm border"
            style={{ width: width }}
        >
            {children}
            <div
                className={`absolute top-0 ${side === 'left' ? '-right-3' : '-left-3'} h-full w-6 flex items-center justify-center cursor-col-resize z-50`}
                onMouseDown={startResizing}
            >
                <div className="w-1 h-8 bg-border rounded-full hover:bg-primary/50 transition-colors">
                    <GripVertical className="w-4 h-4 -ml-1.5 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
};

export const Editor: React.FC = () => {
    const [designerId, setDesignerId] = useState<string>("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [leftWidth, setLeftWidth] = useState(400);
    const [rightWidth, setRightWidth] = useState(400);

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

    return (
        <div className="flex flex-col min-h-screen max-h-screen bg-muted/5">
            <EditorTour />

            {/* Main Editor Grid */}
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* Left Sidebar */}
                <ResizablePanel side="left" width={leftWidth} setWidth={setLeftWidth}>
                    <div className="flex h-full flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Editor Tools</h2>
                            <UndoRedoControls />
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6 pr-2">
                                {/* Section content remains the same */}
                                {/* Product Section */}
                                <section>
                                    <SectionHeader>Product Selection</SectionHeader>
                                    <ProductSelector />
                                </section>

                                {/* Design Tools Section */}
                                <section>
                                    <SectionHeader>Design Tools</SectionHeader>
                                    <div className="space-y-4">
                                        <Card className="p-4 shadow-sm">
                                            <DesignSelector />
                                        </Card>
                                        <Card className="p-4 shadow-sm">
                                            <LayerPanel />
                                        </Card>
                                    </div>
                                </section>

                                {/* Transform Tools Section */}
                                <section>
                                    <SectionHeader>Transform & Effects</SectionHeader>
                                    <div className="space-y-4">
                                        <Card className="p-4 shadow-sm">
                                            <TransformControls />
                                        </Card>
                                        <Card className="p-4 shadow-sm">
                                            <CurvatureControls />
                                        </Card>
                                    </div>
                                </section>

                                {/* Save & Export Section */}
                                <section>
                                    <SectionHeader>Save & Export</SectionHeader>
                                    <div className="space-y-4">
                                        <Card className="p-4 shadow-sm">
                                            <SaveProduct />
                                        </Card>
                                        <Card className="upload-zone p-4 shadow-sm">
                                            <Toolbar onExport={handleExport} />
                                        </Card>
                                    </div>
                                </section>
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                {/* Canvas Area - Fills remaining space */}
                <div className="flex-1 min-w-0 bg-background rounded-lg shadow-sm border overflow-hidden">
                    <div className="w-full h-full relative">
                        <Canvas />
                    </div>
                </div>

                {/* Right Sidebar */}
                <ResizablePanel side="right" width={rightWidth} setWidth={setRightWidth}>
                    <div className="flex h-full flex-col">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">Design Preview</h2>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6 pr-2">
                                <section>
                                    <SectionHeader>Position Guide</SectionHeader>
                                    <Card className="p-4 shadow-sm">
                                        <PositionGuide />
                                    </Card>
                                </section>

                                <section>
                                    <SectionHeader>Active Designs</SectionHeader>
                                    <Card className="p-4 shadow-sm">
                                        <DesignsPanel />
                                    </Card>
                                </section>
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </div>
        </div>
    );
};

export default Editor;