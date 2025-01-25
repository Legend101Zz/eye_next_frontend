//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEditor } from "../../store/editorStore";
import { Upload, Palette, Layout, Layers, Move, Eye, Settings, ZoomIn, Mouse, RefreshCw, Image, Save, ShoppingCart, Check } from 'lucide-react';

const EditorTour = () => {
    const [showTour, setShowTour] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { setActiveView } = useEditor();
    const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('editorTourCompleted');
        if (!hasSeenTour) {
            setShowTour(true);
        }
    }, []);

    const scrollToElement = (selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add highlight effect
            element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
            // Remove highlight after animation
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
            }, 2000);
        }
    };

    // Scroll handler for when tour step changes
    useEffect(() => {
        if (showTour && tourSteps[currentStep].highlight) {
            scrollToElement(tourSteps[currentStep].highlight);
        }
    }, [currentStep, showTour]);

    const tourSteps = [
        {
            title: "Welcome to the Design Editor! 👋",
            description: "Let's explore our powerful design editor that helps you create and customize product designs with ease.",
            icon: <Layout className="w-12 h-12 text-primary" />,
            overlay: "full",
            textColor: "text-primary"
        },
        {
            title: "Product Selection",
            description: "Start by choosing your product and customizing colors. We'll show you exactly where your designs can be placed.",
            icon: <Settings className="w-12 h-12 text-primary" />,
            highlight: ".product-selector",
            position: "left",
            textColor: "text-foreground",
            animation: (
                <motion.div className="space-y-3">
                    <motion.div
                        className="h-8 bg-primary/20 rounded flex items-center px-3 text-foreground"
                        animate={{
                            backgroundColor: ["hsl(221,83%,53%,0.2)", "hsl(221,83%,53%,0.3)"],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Product Type
                    </motion.div>
                    <div className="flex gap-2">
                        {["#FF0000", "#00FF00", "#0000FF"].map((color, i) => (
                            <motion.div
                                key={color}
                                className="w-6 h-6 rounded-full border-2 border-white"
                                style={{ backgroundColor: color }}
                                animate={{ scale: i === 0 ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </motion.div>
            )
        },
        {
            title: "Design Library",
            description: "Browse your design library or upload new designs. We support PNG, JPG, and SVG formats.",
            icon: <Image className="w-12 h-12 text-primary" />,
            highlight: ".design-selector",
            position: "left",
            textColor: "text-foreground",
            animation: (
                <motion.div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="aspect-square bg-primary/20 rounded border border-white/20"
                            animate={{
                                scale: i === 2 ? [1, 1.1, 1] : 1,
                                opacity: i === 2 ? [0.5, 1, 0.5] : 0.5
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    ))}
                </motion.div>
            )
        },
        {
            title: "Layer Management",
            description: "Organize multiple designs easily. Change their order, adjust opacity, and create stunning layered effects.",
            icon: <Layers className="w-12 h-12 text-primary" />,
            highlight: ".layer-panel",
            position: "left",
            textColor: "text-foreground",
            animation: (
                <motion.div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="h-8 bg-primary/20 rounded flex items-center justify-between px-3 text-foreground"
                            animate={{
                                x: i === 1 ? [0, 10, 0] : 0,
                                opacity: i === 1 ? [0.5, 1, 0.5] : 0.5
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span>Layer {i}</span>
                            <div className="flex gap-1">
                                <Eye className="w-4 h-4" />
                                <motion.div
                                    className="w-4 h-4"
                                    animate={{ rotate: i === 1 ? [0, 360] : 0 }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <Move className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )
        },
        {
            title: "Transform Controls",
            description: "Adjust your designs with precision. Use the arrow keys for fine movements, and Shift+Arrow for larger adjustments.",
            icon: <Move className="w-12 h-12 text-primary" />,
            highlight: ".transform-controls",
            position: "left",
            textColor: "text-foreground"
        },
        {
            title: "Position Guide",
            description: "Keep track of your design placement. The guide shows safe areas and warns if your design might get cut off during printing.",
            icon: <Mouse className="w-12 h-12 text-primary" />,
            highlight: ".position-guide",
            position: "right",
            textColor: "text-foreground"
        },
        {
            title: "Surface Mapping",
            description: "Make your designs look natural on the product. Add realistic curves and depth to match the product's surface.",
            icon: <Settings className="w-12 h-12 text-primary" />,
            highlight: ".curvature-controls",
            position: "left",
            textColor: "text-foreground"
        },
        {
            title: "Ready to Sell",
            description: "Save your design and prepare it for your store. Set pricing, add product details, and make it available to your customers!",
            icon: <ShoppingCart className="w-12 h-12 text-primary" />,
            highlight: ".save-controls",
            position: "left",
            textColor: "text-foreground",
            animation: (
                <motion.div className="space-y-2">
                    <motion.div
                        className="p-3 bg-primary/20 rounded flex items-center justify-between text-foreground"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span>Product Details</span>
                        <Check className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                        className="p-3 bg-primary/20 rounded flex items-center justify-between text-foreground"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    >
                        <span>Set Price</span>
                        <Check className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                        className="p-3 bg-primary/20 rounded flex items-center justify-between text-foreground"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                        <span>Publish</span>
                        <Check className="w-4 h-4" />
                    </motion.div>
                </motion.div>
            )
        }
    ];

    const highlightStyles = (position: string) => {
        let baseStyles = "fixed bg-black/70 backdrop-blur-sm";
        switch (position) {
            case "left": return `${baseStyles} top-0 left-0 bottom-0`;
            case "right": return `${baseStyles} top-0 right-0 bottom-0`;
            case "top": return `${baseStyles} top-0 left-0 right-0`;
            case "bottom": return `${baseStyles} bottom-0 left-0 right-0`;
            default: return `${baseStyles} inset-0`;
        }
    };

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const completeTour = () => {
        localStorage.setItem('editorTourCompleted', 'true');
        setShowTour(false);
    };

    if (!showTour) return null;

    const currentStepData = tourSteps[currentStep];

    return (
        <AnimatePresence>
            {showTour && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                    >
                        <div className={highlightStyles(currentStepData.position || "full")} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
                    >
                        <Card className="p-6 backdrop-blur-xl bg-background shadow-2xl border-2 border-primary/20">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    {currentStepData.icon}
                                    <div>
                                        <h3 className={`text-lg  font-semibold ${currentStepData.textColor}`}>
                                            {currentStepData.title}
                                        </h3>
                                        <p className="text-black">
                                            {currentStepData.description}
                                        </p>
                                    </div>
                                </div>

                                {currentStepData.animation && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        {currentStepData.animation}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-center gap-1">
                                        {tourSteps.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-primary' : 'bg-primary/20'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <Button
                                            variant="outline"
                                            onClick={handlePrevious}
                                            disabled={currentStep === 0}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={completeTour}
                                        >
                                            Skip Tour
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                        >
                                            {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditorTour;