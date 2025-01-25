//@ts-nocheck
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useEditor } from "../../../../store/editorStore";
import { validateDesignSize } from '../../../../utils/validation';
import { calculateInitialScale, getImageDimensions } from '../../../../utils/designScaling';
import { DESIGN_AREAS } from '../../../../hooks/useCanvas';
import { Design, BlendMode } from '../../../../types/editor.types';

export const DesignUpload: React.FC = () => {
    const {
        addDesignToCanvas,
        activeView,
        designsByView
    } = useEditor();

    const { toast } = useToast();

    const createNewDesign = useCallback((imageUrl: string, dimensions: { width: number; height: number }, isTest = false) => {
        const uniqueId = nanoid();
        console.log('Creating new design with image:', {
            imageUrl: imageUrl.substring(0, 100) + '...', // Log first 100 chars of URL
            dimensions,
            position: {
                x: 300 + (designsByView[activeView].length * 20),
                y: 300 + (designsByView[activeView].length * 20)
            },
        });


        return {
            id: uniqueId,
            _id: isTest ? `test-${nanoid()}` : undefined, // Add _id for test designs
            name: `test_design_${uniqueId}`,
            imageUrl,
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
            blendMode: 'normal' as BlendMode,
            zIndex: designsByView[activeView].length,
            isTestDesign: isTest
        };
    }, [activeView, designsByView]);

    const processFile = async (file: File, isTest = false) => {
        try {
            const isValidSize = await validateDesignSize(file);
            if (!isValidSize) {
                toast({
                    title: "Invalid Image",
                    description: "Image dimensions must be between 300px and 4000px",
                    variant: "destructive",
                });
                return;
            }

            // Create a data URL from the file
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error("Error processing file:", error);
            throw error;
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            // Process the file
            const imageUrl = await processFile(file, true); // Testing mode by default
            const dimensions = await getImageDimensions(imageUrl!);

            // Create and add the design
            const newDesign = createNewDesign(imageUrl!, dimensions, true);
            console.log('add design in uplaod', newDesign, activeView)
            addDesignToCanvas(newDesign, activeView);

            toast({
                title: "Test Design Added",
                description: `Design has been added to ${activeView} view (Test Mode)`,
                duration: 2000,
            });
        } catch (error) {
            console.error("Error handling file:", error);
            toast({
                title: "Error",
                description: "Failed to process the image",
                variant: "destructive",
            });
        }
    }, [addDesignToCanvas, activeView, toast, createNewDesign]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg']
        },
        multiple: false
    });

    const designCount = designsByView[activeView].length;
    const testDesignCount = designsByView[activeView].filter(d => d.isTestDesign).length;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">Design Upload</h3>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {testDesignCount} test
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {designCount - testDesignCount} saved
                        </Badge>
                    </div>
                </div>

                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-600 text-xs">
                        Test Mode: Designs added here won&apos;t be saved to your library
                    </AlertDescription>
                </Alert>
            </div>

            <Card
                {...getRootProps()}
                className={`
                    relative p-6 border-2 border-dashed cursor-pointer transition-all duration-200
                    hover:border-primary/50 hover:bg-primary/5
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3 text-sm">
                    <div className={`
                        p-3 rounded-full bg-primary/10 transition-transform duration-200
                        ${isDragActive ? 'scale-110' : ''}
                    `}>
                        <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium text-foreground">
                            {isDragActive ? 'Drop to test design' : 'Upload to test'}
                        </p>
                        <p className="text-xs text-primary">
                            Drag and drop or click to select a design for testing
                        </p>
                    </div>
                </div>
            </Card>

            {designCount > 0 && (
                <p className="text-xs text-muted-foreground text-center bg-muted/30 py-2 px-3 rounded-md">
                    💡 Tip: New designs are automatically offset for easier arrangement
                </p>
            )}
        </div>
    );
};