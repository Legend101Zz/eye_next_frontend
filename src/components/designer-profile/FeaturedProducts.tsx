'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBagIcon, HeartIcon, ShareIcon } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    likes: number;
}

interface FeaturedProductsProps {
    products: Product[];
    onProductClick: (id: string) => void;
}

export const FeaturedProducts = ({ products, onProductClick }: FeaturedProductsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div ref={containerRef} className="py-24 bg-gradient-to-b from-black to-background overflow-hidden">
            <motion.div
                className="max-w-7xl mx-auto px-4"
                style={{ y }}
            >
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <ShoppingBagIcon className="w-4 h-4 text-accent" />
                        <span className="text-accent text-sm font-medium">Featured Products</span>
                    </motion.div>
                    <h2 className="text-4xl font-heading1 text-white mb-4">Shop Top Sellers</h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Discover the most popular products featuring our designer&apos;s unique artwork
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <motion.div
                                className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Quick Actions */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
                                        >
                                            <HeartIcon className="w-4 h-4 text-white" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
                                        >
                                            <ShareIcon className="w-4 h-4 text-white" />
                                        </motion.button>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium text-white group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-white">
                                            ${product.price}
                                        </span>
                                        <div className="flex items-center gap-1 text-white/60">
                                            <HeartIcon className="w-4 h-4" />
                                            <span className="text-sm">{product.likes}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        className="w-full mt-4 bg-accent hover:bg-accent/90 text-white"
                                        onClick={() => onProductClick(product.id)}
                                    >
                                        View Product
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};