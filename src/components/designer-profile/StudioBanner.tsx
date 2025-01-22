'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Share2Icon, HeartIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface StudioBannerProps {
    designerName: string;
    profileImage: string;
    coverImage: string;
    description: string;
    followers: number;
    totalDesigns: number;
    totalSales: number;
    onShare: () => void;
    onFollow: () => void;
}

export const StudioBanner = ({
    designerName,
    profileImage,
    coverImage,
    description,
    followers,
    totalDesigns,
    totalSales,
    onShare,
    onFollow
}: StudioBannerProps) => {
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true
    });

    return (
        <div ref={ref} className="relative h-[85vh] flex items-end">
            {/* Background with parallax effect */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                animate={{
                    scale: inView ? 1 : 1.1,
                    opacity: inView ? 1 : 0
                }}
                transition={{ duration: 0.7 }}
            >
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-transparent to-black/50" />

                {/* Animated pattern overlay */}
                <div className="absolute inset-0 mix-blend-overlay opacity-20"
                    style={{
                        backgroundImage: 'url("/pattern.svg")',
                        backgroundSize: '30px 30px'
                    }}
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-20">
                <motion.div
                    className="flex flex-col md:flex-row gap-8 items-end"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Profile Image */}
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="relative w-32 h-32 md:w-48 md:h-48">
                            {/* Animated border */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-accent rounded-2xl opacity-75 blur group-hover:opacity-100 animate-gradient-xy" />
                            <div className="relative rounded-2xl overflow-hidden">
                                <Image
                                    src={profileImage}
                                    alt={designerName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Section */}
                    <div className="flex-1">
                        <motion.div
                            className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-heading1 text-white mb-2">{designerName}</h1>
                                    <div className="flex items-center gap-4 text-white/60">
                                        <span>{followers} followers</span>
                                        <span>•</span>
                                        <span>{totalDesigns} designs</span>
                                        <span>•</span>
                                        <span>{totalSales} sales</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full border-white/10 hover:bg-white/10"
                                        onClick={onShare}
                                    >
                                        <Share2Icon className="mr-2 h-4 w-4" />
                                        Share
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-accent hover:bg-accent/90"
                                        onClick={onFollow}
                                    >
                                        <HeartIcon className="mr-2 h-4 w-4" />
                                        Follow
                                    </Button>
                                </div>
                            </div>
                            <p className="text-lg text-white/80 max-w-2xl">
                                {description}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};