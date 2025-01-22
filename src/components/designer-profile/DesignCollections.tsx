'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface Collection {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    designCount: number;
}

interface DesignCollectionsProps {
    collections: Collection[];
    onCollectionClick: (id: string) => void;
}

export const DesignCollections = ({ collections, onCollectionClick }: DesignCollectionsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <motion.div
            ref={containerRef}
            className="py-20 bg-gradient-to-b from-background to-black"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-heading1 text-white mb-4">Design Collections</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Explore curated collections of designs across different styles and categories
                    </p>
                </motion.div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onCollectionClick(collection.id)}
                            className="group cursor-pointer"
                        >
                            <motion.div
                                className="relative aspect-[4/3] rounded-xl overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src={collection.imageUrl}
                                    alt={collection.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <h3 className="text-2xl font-heading1 text-white mb-2">
                                        {collection.title}
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">
                                        {collection.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">
                                            {collection.designCount} designs
                                        </span>
                                        <motion.div
                                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg
                                                className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};