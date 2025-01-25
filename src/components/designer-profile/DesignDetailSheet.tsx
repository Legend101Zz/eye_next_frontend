//@ts-nocheck
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import {
    HeartIcon,
    Share1Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ZoomInIcon
} from '@radix-ui/react-icons';
import { format } from 'date-fns';

interface DesignImage {
    url: string;
    filename: string;
}

interface Design {
    _id: string;
    title: string;
    description?: string;
    designImages: DesignImage[];
    tags?: string[];
    likes?: number;
    views?: number;
    createdAt?: string;
    materials?: string[];
    dimensions?: {
        width: number;
        height: number;
    };
}

interface DesignDetailProps {
    design: Design | null;
    onClose: () => void;
    onShare: (design: Design) => void;
}

export const DesignDetailSheet = ({ design, onClose, onShare }: DesignDetailProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!design) return null;

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? design.designImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === design.designImages.length - 1 ? 0 : prev + 1
        );
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // Add your like functionality here
    };

    return (
        <Sheet open={!!design} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-2xl p-0 bg-black/95 text-white border-l border-white/10"
            >
                <div className="h-full overflow-y-auto overflow-x-hidden">
                    {/* Image Section */}
                    <div className="relative">
                        <motion.div
                            className={`relative ${isZoomed ? 'h-[80vh]' : 'aspect-square'} group`}
                            layout
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={design.designImages[currentImageIndex]?.url || '/placeholder.png'}
                                        alt={`${design.title} - Image ${currentImageIndex + 1}`}
                                        fill
                                        className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                                            }`}
                                        onClick={() => setIsZoomed(!isZoomed)}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Image Navigation */}
                            {design.designImages.length > 1 && (
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-black/50 hover:bg-black/70"
                                        onClick={handlePrevImage}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-black/50 hover:bg-black/70"
                                        onClick={handleNextImage}
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}

                            {/* Image Counter */}
                            {design.designImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {design.designImages.length}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                    onClick={handleLike}
                                >
                                    <HeartIcon className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full"
                                    onClick={() => onShare(design)}
                                >
                                    <Share1Icon className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-8">
                        <SheetHeader>
                            <SheetTitle className="text-3xl font-heading1 text-white">
                                {design.title}
                            </SheetTitle>
                            {design.createdAt && (
                                <p className="text-sm text-gray-400">
                                    Created {format(new Date(design.createdAt), 'MMMM dd, yyyy')}
                                </p>
                            )}
                        </SheetHeader>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                className="bg-white/5 rounded-lg p-4 text-center"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="text-2xl font-bold text-accent">{design.likes || 0}</div>
                                <div className="text-sm text-gray-400">Likes</div>
                            </motion.div>
                            <motion.div
                                className="bg-white/5 rounded-lg p-4 text-center"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="text-2xl font-bold text-accent">{design.views || 0}</div>
                                <div className="text-sm text-gray-400">Views</div>
                            </motion.div>
                            <motion.div
                                className="bg-white/5 rounded-lg p-4 text-center"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="text-2xl font-bold text-accent">
                                    {design.designImages.length}
                                </div>
                                <div className="text-sm text-gray-400">Images</div>
                            </motion.div>
                        </div>

                        {/* Description */}
                        {design.description && (
                            <motion.div
                                className="bg-white/5 rounded-lg p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className="text-lg font-medium mb-2">About this design</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {design.description}
                                </p>
                            </motion.div>
                        )}

                        {/* Specifications */}
                        {(design.materials?.length > 0 || design.dimensions) && (
                            <div className="bg-white/5 rounded-lg p-6 space-y-4">
                                <h3 className="text-lg font-medium">Specifications</h3>
                                {design.materials && (
                                    <div>
                                        <h4 className="text-sm text-gray-400 mb-2">Materials</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {design.materials.map((material) => (
                                                <span
                                                    key={material}
                                                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                                                >
                                                    {material}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {design.dimensions && (
                                    <div>
                                        <h4 className="text-sm text-gray-400 mb-2">Dimensions</h4>
                                        <p className="text-white">
                                            {design.dimensions.width}″ × {design.dimensions.height}″
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tags */}
                        {design.tags && design.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {design.tags.map((tag) => (
                                        <motion.span
                                            key={tag}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm cursor-pointer"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <Button
                                className="w-full bg-accent hover:bg-accent/90 text-white h-12 rounded-xl"
                                asChild
                            >
                                <Link href={`/editor?designId=${design._id}`}>
                                    Customize This Design
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full border-white/10 text-white hover:bg-white/5 h-12 rounded-xl"
                                asChild
                            >
                                <Link href={`/product/${design._id}`}>
                                    View Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};