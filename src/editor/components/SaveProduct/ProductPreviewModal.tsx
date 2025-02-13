//@ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Progress from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Shirt,
    ShirtIcon,
    Save,
    Loader2,
    X,
    ChevronRight,
    CheckCircle2,
    Search,
    ImageOff
} from 'lucide-react';
import { useEditor } from "../../store/editorStore";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Design, ViewType } from "../../types/editor.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// Constants for canvas dimensions
const CANVAS_DIMENSIONS = {
    preview: {
        width: 1200,
        height: 1440
    },
    main: {
        width: 500,
        height: 600
    }
};

interface DesignState {
    [productId: string]: {
        [view: string]: Design[];
    };
}


// Utility function to optimize image size
const optimizeImage = async (dataUrl: string, maxSizeMB = 2): Promise<string> => {
    const getImageSize = (dataUrl: string) => {
        const base64Length = dataUrl.split(',')[1].length;
        return (base64Length * 3) / 4;
    };

    // Convert base64 to Blob for processing
    const base64Response = await fetch(dataUrl);
    let blob = await base64Response.blob();

    // If size is already under maxSizeMB, return original
    if (blob.size <= maxSizeMB * 1024 * 1024) {
        return dataUrl;
    }

    // Create temporary canvas for resizing
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    await new Promise((resolve) => {
        img.onload = resolve;
        img.src = dataUrl;
    });

    // Start with original dimensions
    let width = img.width;
    let height = img.height;
    let quality = 0.9; // Start with high quality

    // First try just reducing quality
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    let optimizedDataUrl = canvas.toDataURL('image/png', quality);
    let currentSize = getImageSize(optimizedDataUrl);

    // If still too large, reduce dimensions while maintaining aspect ratio
    while (currentSize > maxSizeMB * 1024 * 1024 && width > 800) { // Don't go below 800px width
        width *= 0.9;
        height *= 0.9;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        optimizedDataUrl = canvas.toDataURL('image/png', quality);
        currentSize = getImageSize(optimizedDataUrl);
    }

    // Log final optimized size
    console.log('Optimized Image Details:', {
        width,
        height,
        quality,
        sizeInMB: (currentSize / (1024 * 1024)).toFixed(2) + ' MB'
    });

    return optimizedDataUrl;
};

// Utility function to convert relative coordinates to absolute
const convertToRelativePosition = (position: { x: number, y: number }, canvasDimensions: { width: number, height: number }) => {
    return {
        x: position.x / canvasDimensions.width,
        y: position.y / canvasDimensions.height
    };
};

// Utility function to convert relative coordinates back to absolute
const convertToAbsolutePosition = (relativePosition: { x: number, y: number }, canvasDimensions: { width: number, height: number }) => {
    return {
        x: relativePosition.x * canvasDimensions.width,
        y: relativePosition.y * canvasDimensions.height
    };
};


// Helper function to properly scale positions and dimensions
const scaleDesignTransform = (
    design: Design,
    sourceCanvas: { width: number, height: number },
    targetCanvas: { width: number, height: number }
) => {
    // Convert current position to relative coordinates
    const relativePosition = convertToRelativePosition(
        design.transform.position,
        sourceCanvas
    );

    // Convert relative position to target canvas coordinates
    const scaledPosition = convertToAbsolutePosition(
        relativePosition,
        targetCanvas
    );

    // Calculate scale ratio between canvases
    const scaleRatio = Math.min(
        targetCanvas.width / sourceCanvas.width,
        targetCanvas.height / sourceCanvas.height
    );

    // Return scaled transform
    return {
        position: {
            x: scaledPosition.x,
            y: scaledPosition.y
        },
        scale: design.transform.scale * scaleRatio,
        rotation: design.transform.rotation
    };
};

interface PreviewCardProps {
    view: ViewType;
    imageUrl?: string | null;
    productName: string;
    isLoading?: boolean;
}

interface ProductPreview {
    id: string;
    name: string;
    previews: {
        front: string | null;
        back: string | null;
    };
}

// Helper Components

// Create a new ZoomModal component first
const ZoomModal = ({
    isOpen,
    onClose,
    imageUrl,
    view
}: {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    view: string;
}) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-full p-0">
            <div className="relative bg-background rounded-lg shadow-lg">
                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 z-50 hover:bg-black/10"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>

                {/* Image container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                    <img
                        src={imageUrl}
                        alt={`${view} view zoomed`}
                        className="w-full h-full object-contain p-4"
                    />

                    {/* View label */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full capitalize">
                        {view} view
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
);

const ProductIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case 'shirt':
            return <Shirt className="w-5 h-5" />;
        case 'tshirt':
            return <ShirtIcon className="w-5 h-5" />;
        default:
            return <X className="w-5 h-5" />;
    }
};

const SaveProgress = ({ progress }: { progress: number }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span>Creating your product</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2">
            <Progress value={progress} />
            <motion.div
                className="absolute top-0 left-0 h-full w-[4px] bg-primary/50"
                animate={{
                    x: ["0%", "100%"],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    </div>
);

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
    <div className="flex items-center gap-4 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
                <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${index + 1 <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    transition-colors duration-200
                `}>
                    {index + 1 <= currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                    )}
                </div>
                {index < totalSteps - 1 && (
                    <div className={`
                        w-12 h-0.5 mx-2
                        ${index + 1 < currentStep ? 'bg-primary' : 'bg-muted'}
                        transition-colors duration-200
                    `} />
                )}
            </div>
        ))}
    </div>
);

const PreviewCard = ({ view, imageUrl, productName, isLoading = false }: PreviewCardProps) => {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            <Card
                className="overflow-hidden group"
                onClick={() => imageUrl && setIsZoomed(true)}
            >
                <div className="aspect-[3/4] relative bg-muted/10 rounded-t-lg overflow-hidden">
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : imageUrl ? (
                        <>
                            <img
                                src={imageUrl}
                                alt={`${view} view`}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                                <div className="text-center text-black p-4">
                                    <Search className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-sm">Click to zoom</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary">
                            <div className="text-center">
                                <ImageOff className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm">No preview available</span>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-black text-xs px-2 py-1 rounded-full capitalize">
                        {view} view
                    </div>
                </div>
                <div className="p-3">
                    <div className="text-sm font-medium">{productName}</div>
                    <div className="text-xs text-primary mt-1">Click to preview design placement</div>
                </div>
            </Card>

            {imageUrl && (
                <ZoomModal
                    isOpen={isZoomed}
                    onClose={() => setIsZoomed(false)}
                    imageUrl={imageUrl}
                    view={view}
                />
            )}
        </>
    );
};

export const ProductPreviewModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [designStates, setDesignStates] = useState<DesignState>({});
    const [productFormData, setProductFormData] = useState({
        productName: '',
        gender: 'UNISEX',
        designPrice: '0',
        tags: '',
        tagsArray: []
    });
    const { toast } = useToast();

    const {
        availableProducts,
        designsByView,
        createFinalProduct,
        activeView,
        garmentColor,
        activeProductId
    } = useEditor();


    // Set global CORS setting for fabric
    fabric.Image.prototype.crossOrigin = 'anonymous';

    // Function to generate preview for a specific view
    const generateViewPreview = useCallback(async (view, productId) => {
        try {
            const product = availableProducts.find(p => p.id === productId);
            if (!product) return null;

            // Create a temporary canvas with higher DPI settings
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2

            // Set canvas dimensions with DPI scaling
            tempCanvas.width = CANVAS_DIMENSIONS.preview.width;
            tempCanvas.height = CANVAS_DIMENSIONS.preview.height;

            // Scale the context for high DPI
            ctx.scale(dpr, dpr);

            // Initialize Fabric canvas with high-quality settings
            const fabricCanvas = new fabric.Canvas(tempCanvas, {
                enableRetinaScaling: true,
                imageSmoothingQuality: 'high',
                preserveObjectStacking: true
            });

            // Load mockup image
            const mockupUrl = product.images[garmentColor]?.[view];
            if (!mockupUrl) return null;

            await new Promise((resolve) => {
                fabric.Image.fromURL(mockupUrl, (mockupImg) => {
                    if (!mockupImg.width || !mockupImg.height) {
                        resolve();
                        return;
                    }

                    const scale = Math.min(
                        CANVAS_DIMENSIONS.preview.width / mockupImg.width,
                        CANVAS_DIMENSIONS.preview.height / mockupImg.height
                    );

                    mockupImg.set({
                        scaleX: scale,
                        scaleY: scale,
                        left: 0,
                        top: 0,
                        selectable: false,
                        evented: false,
                        quality: 1
                    });

                    fabricCanvas.add(mockupImg);
                    fabricCanvas.sendToBack(mockupImg);
                    resolve();
                }, { crossOrigin: 'anonymous', quality: 1 });
            });

            // Load and position designs
            const designs = designStates[productId]?.[view] || designsByView[view];

            await Promise.all(designs.map(async (design) => {
                return new Promise((resolve) => {
                    fabric.Image.fromURL(design.imageUrl, (img) => {
                        if (!img.width || !img.height) {
                            resolve();
                            return;
                        }

                        const applyBlendMode = (fabricObject: fabric.Image, design: Design) => {
                            const blendMode = design.blendMode || 'normal';
                            let compositeOperation = 'source-over';

                            switch (blendMode) {
                                case 'multiply':
                                    compositeOperation = 'multiply';
                                    break;
                                case 'screen':
                                    compositeOperation = 'screen';
                                    break;
                                case 'overlay':
                                    compositeOperation = 'overlay';
                                    break;
                                case 'darken':
                                    compositeOperation = 'darken';
                                    break;
                                case 'lighten':
                                    compositeOperation = 'lighten';
                                    break;
                            }

                            img.set({
                                globalCompositeOperation: compositeOperation,
                                opacity: design.opacity || 1, quality: 1,
                                imageSmoothingQuality: 'high'
                            });
                        };

                        // Scale the design's transform properties
                        const scaledTransform = scaleDesignTransform(
                            design,
                            CANVAS_DIMENSIONS.main,
                            CANVAS_DIMENSIONS.preview
                        );

                        img.set({
                            left: scaledTransform.position.x,
                            top: scaledTransform.position.y,
                            scaleX: scaledTransform.scale,
                            scaleY: scaledTransform.scale,
                            angle: scaledTransform.rotation,
                            opacity: design.opacity || 1,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                            quality: 1,
                            imageSmoothingQuality: 'high'
                        });

                        // Apply blend mode and opacity
                        applyBlendMode(img, design);

                        fabricCanvas.add(img);
                        resolve();
                    }, { crossOrigin: 'anonymous', quality: 1 });
                });
            }));

            // Render with high-quality settings
            fabricCanvas.setZoom(1);
            fabricCanvas.renderAll();

            // Export with maximum quality
            let dataUrl = fabricCanvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: dpr,
            });

            // Optimize the image
            dataUrl = await optimizeImage(dataUrl, 2); // 2MB max size

            //Utility function to checking size of image

            const checkImageSize = (dataUrl: string) => {
                // Get size in bytes
                const base64Length = dataUrl.split(',')[1].length;
                const sizeInBytes = (base64Length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                // Log sizes
                console.log('Image Details:', {
                    sizeInBytes,
                    sizeInMB: sizeInMB.toFixed(2) + ' MB',
                    width: fabricCanvas.width,
                    height: fabricCanvas.height,
                    dpr: dpr,
                    totalPixels: fabricCanvas.width * fabricCanvas.height
                });

                return dataUrl;
            };

            checkImageSize(dataUrl);
            // Clean up
            fabricCanvas.dispose();

            return dataUrl;
        } catch (error) {
            console.error(`Error generating ${view} preview:`, error);
            return null;
        }
    }, [availableProducts, designStates, designsByView, garmentColor]);


    const generatePreviews = async (productId: string) => {
        console.log('Starting preview generation for product:', productId);
        setIsGeneratingPreview(true);
        try {
            const product = availableProducts.find(p => p.id === productId);
            if (!product) return null;

            const [frontPreview, backPreview] = await Promise.all([
                generateViewPreview('front', productId),
                generateViewPreview('back', productId)
            ]);

            if (frontPreview || backPreview) {
                const product = availableProducts.find(p => p.id === productId);
                return {
                    id: productId,
                    name: product.name,
                    previews: {
                        front: frontPreview,
                        back: backPreview
                    }
                };
            }
            return null;
        } catch (error) {
            console.error('Error generating previews:', error);
            toast({
                title: "Error",
                description: "Failed to generate previews. Please try again.",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    const handleOpenModal = () => {
        if (!Object.values(designsByView).some(designs => designs.length > 0)) {
            toast({
                title: "No designs added",
                description: "Please add at least one design before saving",
                variant: "destructive"
            });
            return;
        }

        setActiveProduct(null);
        setCurrentStep(1);
        setIsOpen(true);

        // Generate preview for current product immediately
        if (activeProductId) {
            handleProductSelect(activeProductId);
        }
    };

    const handleProductSelect = async (productId: string) => {
        if (activeProduct?.id === productId) return;

        // Create or get design state for this product
        if (!designStates[productId]) {
            // Initialize with current designs
            setDesignStates(prev => ({
                ...prev,
                [productId]: {
                    front: [...designsByView.front],
                    back: [...designsByView.back]
                }
            }));
        }

        const previews = await generatePreviews(productId);
        console.log('previews', previews)
        if (previews) {
            setActiveProduct(previews);
            setCurrentStep(2);
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setActiveProduct(null);
        setDesignStates({});
    };

    const simulateProgress = () => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        return interval;
    };

    const handleSave = async () => {
        if (!activeProduct) return;

        // Validate form data
        if (!productFormData.productName.trim()) {
            toast({
                title: "Missing Information",
                description: "Please enter a product name",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsSaving(true);
            setCurrentStep(3);
            const progressInterval = simulateProgress();

            // Prepare the final product data
            const productData = new FormData();
            productData.append('productName', productFormData.productName);
            productData.append('gender', productFormData.gender);
            productData.append('designPrice', productFormData.designPrice);

            // Add tags as JSON string
            if (productFormData.tagsArray.length > 0) {
                productData.append('tags', JSON.stringify(productFormData.tagsArray));
            }

            // Add designs
            const designPlacements = [];
            for (const design of designStates[activeProduct.id]?.front || []) {
                console.log('design-designPlacements', design, design._id)
                designPlacements.push({
                    designId: design._id,
                    position: "front",
                    scale: design.transform.scale,
                    rotation: design.transform.rotation,
                    coordinates: {
                        x: design.transform.position.x,
                        y: design.transform.position.y,
                    }
                });
            }
            for (const design of designStates[activeProduct.id]?.back || []) {
                console.log('design-designPlacements', design, design._id)
                designPlacements.push({
                    designId: design._id,
                    position: "back",
                    scale: design.transform.scale,
                    rotation: design.transform.rotation,
                    coordinates: {
                        x: design.transform.position.x,
                        y: design.transform.position.y,
                    }
                });
            }

            // Add designs array as JSON string
            productData.append('designs', JSON.stringify(designPlacements));

            // Add variants
            const variants = [{
                baseProductId: activeProduct.id,
                color: garmentColor
            }];
            productData.append('variants', JSON.stringify(variants));

            // Add processed images
            // Convert base64/dataURL to Blob
            const frontBlob = await fetch(activeProduct.previews.front).then(r => r.blob());
            const backBlob = await fetch(activeProduct.previews.back).then(r => r.blob());
            setProgress(50);
            // Append images with specific names that include the color
            productData.append(
                `frontImage`,
                frontBlob,
                `${productFormData.productName}_${garmentColor}_front.png`
            );
            productData.append(
                `backImage`,
                backBlob,
                `${productFormData.productName}_${garmentColor}_back.png`
            );

            // Add metadata for images
            productData.append('imageMetadata', JSON.stringify({
                baseProductId: activeProduct.id,
                color: garmentColor,
            }));

            setProgress(90);
            await createFinalProduct(productData);

            clearInterval(progressInterval);
            setProgress(100);

            setTimeout(() => {
                setIsSaving(false);
                setIsOpen(false);
                toast({
                    title: "Success! 🎉",
                    description: "Your product has been created successfully.",
                });
            }, 500);
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "Failed to save product. Please try again.",
                variant: "destructive"
            });
            setIsSaving(false);
            setCurrentStep(2);
        }
    };

    // Effect to update previews when designs change
    useEffect(() => {
        if (isOpen && activeProduct) {
            setDesignStates(prev => ({
                ...prev,
                [activeProduct.id]: {
                    front: [...designsByView.front],
                    back: [...designsByView.back]
                }
            }));
            handleProductSelect(activeProduct.id);
        }
    }, [designsByView, isOpen]);

    const productTypes = [...new Set(availableProducts.map(p => p.category.toLowerCase()))];

    return (
        <>
            <Button onClick={handleOpenModal} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Create Product
            </Button>

            <Dialog open={isOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Save className="w-5 h-5" />
                            </div>
                            Create New Product
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Preview your design on different products and create a new product with your design applied.
                            Your design will be placed exactly as shown in the preview.
                        </DialogDescription>
                    </DialogHeader>

                    <StepIndicator currentStep={currentStep} totalSteps={3} />

                    <AnimatePresence mode="wait">
                        {isSaving ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="py-12"
                            >
                                <div className="max-w-md mx-auto text-center space-y-4">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="w-12 h-12 mx-auto text-primary"
                                    >
                                        <Save className="w-full h-full" />
                                    </motion.div>
                                    <h3 className="text-lg font-medium">Creating Your Product</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Please wait while we process your design and create the product...
                                    </p>
                                    <SaveProgress progress={progress} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                <Tabs defaultValue={productTypes[0]} className="w-full">
                                    <TabsList className="w-full justify-start mb-4 p-1 bg-muted/50">
                                        {productTypes.map(type => (
                                            <TabsTrigger
                                                key={type}
                                                value={type}
                                                className="gap-2 data-[state=active]:bg-background"
                                            >
                                                <ProductIcon type={type} />
                                                <span className="capitalize">{type}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {productTypes.map(type => (
                                        <TabsContent key={type} value={type} className="mt-0">
                                            <ScrollArea className="h-[500px] pr-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {availableProducts
                                                        .filter(p => p.category.toLowerCase() === type)
                                                        .map(product => (
                                                            <motion.div
                                                                key={product.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <Card
                                                                    className={`overflow-hidden transition-colors hover:bg-muted/50 cursor-pointer ${activeProduct?.id === product.id ? 'ring-2 ring-primary' : ''
                                                                        }`}
                                                                    onClick={() => handleProductSelect(product.id)}
                                                                >
                                                                    <div className="p-4 space-y-6">
                                                                        {/* Product Header */}
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <ProductIcon type={type} />
                                                                                <span className="font-medium">{product.name}</span>
                                                                            </div>
                                                                            {activeProduct?.id === product.id && (
                                                                                <div className="text-primary">
                                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Product Content */}
                                                                        {activeProduct?.id === product.id ? (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                className="space-y-6"
                                                                            >
                                                                                {/* Preview Cards */}
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <PreviewCard
                                                                                        view="front"
                                                                                        imageUrl={activeProduct.previews.front}
                                                                                        productName={product.name}
                                                                                        isLoading={isGeneratingPreview}
                                                                                    />
                                                                                    <PreviewCard
                                                                                        view="back"
                                                                                        imageUrl={activeProduct.previews.back}
                                                                                        productName={product.name}
                                                                                        isLoading={isGeneratingPreview}
                                                                                    />
                                                                                </div>

                                                                                {/* Product Form */}
                                                                                <Card className="p-6 space-y-6">
                                                                                    <div>
                                                                                        <h3 className="text-lg font-semibold mb-1">Product Information</h3>
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                            Add details for your {product.name}
                                                                                        </p>
                                                                                    </div>

                                                                                    <div className="space-y-4">
                                                                                        {/* Product Name */}
                                                                                        <div className="space-y-2">
                                                                                            <Label>Product Name</Label>
                                                                                            <Input
                                                                                                placeholder="Enter a name for your product"
                                                                                                value={productFormData.productName}
                                                                                                onChange={(e) => setProductFormData(prev => ({
                                                                                                    ...prev,
                                                                                                    productName: e.target.value
                                                                                                }))}
                                                                                                disabled={isGeneratingPreview}
                                                                                            />
                                                                                        </div>

                                                                                        {/* Gender Selection */}
                                                                                        <div className="space-y-2">
                                                                                            <Label>Target Gender</Label>
                                                                                            <RadioGroup
                                                                                                className="flex gap-4"
                                                                                                value={productFormData.gender}
                                                                                                onValueChange={(value) => setProductFormData(prev => ({
                                                                                                    ...prev,
                                                                                                    gender: value
                                                                                                }))}
                                                                                                disabled={isGeneratingPreview}
                                                                                            >
                                                                                                {['male', 'female', 'unisex'].map((gender) => (
                                                                                                    <div key={gender} className="flex items-center space-x-2">
                                                                                                        <RadioGroupItem value={gender} id={gender} />
                                                                                                        <Label htmlFor={gender}>{gender}</Label>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </RadioGroup>
                                                                                        </div>

                                                                                        {/* Design Price */}
                                                                                        <div className="space-y-2">
                                                                                            <Label>Design Price</Label>
                                                                                            <div className="relative">
                                                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                                                    ₹
                                                                                                </span>
                                                                                                <Input
                                                                                                    type="number"
                                                                                                    min="0"
                                                                                                    step="0.01"
                                                                                                    className="pl-8"
                                                                                                    placeholder="0.00"
                                                                                                    value={productFormData.designPrice}
                                                                                                    onChange={(e) => setProductFormData(prev => ({
                                                                                                        ...prev,
                                                                                                        designPrice: e.target.value
                                                                                                    }))}
                                                                                                    disabled={isGeneratingPreview}
                                                                                                />
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Tags */}
                                                                                        <div className="space-y-2">
                                                                                            <Label>Tags</Label>
                                                                                            <Input
                                                                                                placeholder="Add tags separated by commas"
                                                                                                value={productFormData.tags}
                                                                                                onChange={(e) => {
                                                                                                    const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                                                                                                    setProductFormData(prev => ({
                                                                                                        ...prev,
                                                                                                        tags: e.target.value,
                                                                                                        tagsArray
                                                                                                    }));
                                                                                                }}
                                                                                                disabled={isGeneratingPreview}
                                                                                            />
                                                                                            {productFormData.tagsArray?.length > 0 && (
                                                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                                                    {productFormData.tagsArray.map((tag) => (
                                                                                                        tag && <Badge key={tag} variant="secondary">{tag}</Badge>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Save Button */}
                                                                                        <Button
                                                                                            className="w-full"
                                                                                            onClick={handleSave}
                                                                                            disabled={!productFormData.productName.trim() || isGeneratingPreview}
                                                                                        >
                                                                                            {isGeneratingPreview ? (
                                                                                                <>
                                                                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                                                                    Processing...
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <Save className="w-4 h-4 mr-2" />
                                                                                                    Create {product.name}
                                                                                                </>
                                                                                            )}
                                                                                        </Button>
                                                                                    </div>
                                                                                </Card>

                                                                                {/* Preview Details */}
                                                                                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                                                                                    <h4 className="font-medium mb-2">Design Preview Details:</h4>
                                                                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                                                                        <li>• Front and back views shown as they will appear on the product</li>
                                                                                        <li>• Colors and proportions are accurately represented</li>
                                                                                        <li>• Design placement matches your editor layout</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </motion.div>
                                                                        ) : (
                                                                            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                                                                                <div className="text-center p-4">
                                                                                    <div className="text-primary mb-2">
                                                                                        <motion.div
                                                                                            animate={{ scale: [1, 1.1, 1] }}
                                                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                                                        >
                                                                                            <Save className="w-6 h-6 mx-auto" />
                                                                                        </motion.div>
                                                                                    </div>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        Click to preview your design
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Card>
                                                            </motion.div>
                                                        ))}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                {/* Close button */}
                                <div className="pt-4 border-t">
                                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </>
    );
};