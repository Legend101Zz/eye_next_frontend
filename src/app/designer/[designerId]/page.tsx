'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { SocialBar } from '@/components/designer-profile/SocialBar';
import { DesignGrid } from '@/components/designer-profile/DesignGrid';
import { DesignDetailSheet } from '@/components/designer-profile/DesignDetailSheet';
import {
    Share1Icon,
    PersonIcon,
    GlobeIcon,
    EnvelopeClosedIcon,
    LockClosedIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';


const LoadingState = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Loading Hero */}
            <div className="relative h-[80vh] flex items-end">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-accent/20 via-black to-background" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 w-full pb-20">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Profile Image Skeleton */}
                        <Skeleton className="w-40 h-40 rounded-2xl bg-white/5" />

                        {/* Profile Info Skeletons */}
                        <div className="flex-1 space-y-6">
                            <Skeleton className="h-12 w-64 bg-white/5" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full max-w-2xl bg-white/5" />
                                <Skeleton className="h-4 w-5/6 bg-white/5" />
                                <Skeleton className="h-4 w-4/6 bg-white/5" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                                <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                                <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                            </div>
                            <div className="flex gap-6">
                                <Skeleton className="h-8 w-32 bg-white/5" />
                                <Skeleton className="h-8 w-32 bg-white/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Designs Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <Skeleton className="h-10 w-64 mx-auto mb-12 bg-white/5" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square relative">
                            <Skeleton className="absolute inset-0 rounded-xl bg-white/5" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Animation Overlay */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{
                        x: ['100%', '-100%'],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                />
            </div>
        </div>
    );
};

const PrivateProfileState = ({ designerName }: { designerName: string }) => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Lock Animation */}
                <motion.div
                    className="relative w-32 h-32 mx-auto mb-8"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                >
                    {/* Lock Circle */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-accent/10"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                        }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center"
                        >
                            <LockClosedIcon className="w-8 h-8 text-accent" />
                        </motion.div>
                    </div>
                </motion.div>

                <div className="text-center space-y-6 bg-black/40 backdrop-blur-sm p-8 rounded-2xl">
                    <motion.h2
                        className="text-3xl font-heading1 text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Private Profile
                    </motion.h2>

                    <motion.p
                        className="text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {designerName}&apos;s profile is currently set to private. Follow them to see their designs and updates.
                    </motion.p>

                    <motion.div
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            variant="outline"
                            className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10"
                        >
                            Request to Follow
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const ErrorState = ({ error }: { error: string }) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        // Add artificial delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Error Icon Animation */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 rounded-full bg-red-500/10"
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                            <ExclamationIcon className="w-8 h-8 text-red-500" />
                        </div>
                    </motion.div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl">
                    <h2 className="text-3xl font-heading1 text-white mb-4">Oops!</h2>
                    <p className="text-gray-400 mb-8">{error}</p>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            className="bg-accent hover:bg-accent/90 text-white"
                            onClick={handleRetry}
                            disabled={isRetrying}
                        >
                            {isRetrying ? (
                                <motion.div
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear",
                                    }}
                                />
                            ) : (
                                'Try Again'
                            )}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const ExclamationIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const DesignerPublicProfile = ({ params }: { params: { designerId: string } }) => {
    const { isPrivate, data, designs, loading, error } = usePublicProfile(params.designerId);
    const [selectedDesign, setSelectedDesign] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Designs');
    const [totalDesigns] = useState(designs.length * 2); // For demo purposes

    // Filter designs based on active filter
    const filteredDesigns = useMemo(() => {
        if (activeFilter === 'All Designs') return designs;
        if (activeFilter === 'Popular') return designs.filter(d => d.likes > 50);
        if (activeFilter === 'Recent') return designs.filter(d =>
            new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        return designs.filter(d => d.category.toLowerCase() === activeFilter.toLowerCase());
    }, [designs, activeFilter]);

    const handleLoadMore = async () => {
        // Implement your load more logic here
        console.log("Loading more designs...");
    };

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async (design?: any) => {
        try {
            const shareData = {
                title: design
                    ? `${design.title} by ${data?.name}`
                    : `${data?.name}'s Designer Profile`,
                text: design
                    ? `Check out this amazing design by ${data?.name} on Deauth!`
                    : `Check out ${data?.name}'s amazing designs on Deauth!`,
                url: window.location.href + (design ? `?design=${design._id}` : ''),
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                // Show toast notification that URL was copied
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) return <LoadingState />;
    if (isPrivate) return <PrivateProfileState designerName={data?.name || 'This designer'} />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-transparent"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {data?.profileImage && (
                            <Image
                                src={data.profileImage}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}
                        <h1 className="text-xl font-heading1 text-white">{data?.name}</h1>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-white/10 hover:bg-white/20"
                                        onClick={() => handleShare()}
                                    >
                                        <Share1Icon className="w-5 h-5 text-white" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share Profile</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </motion.div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <div className="relative min-h-[90vh] flex items-end pb-32">
                {/* Background Image with Enhanced Overlay */}
                <div className="absolute inset-0">
                    {data?.coverImage ? (
                        <>
                            <Image
                                src={data.coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Multiple gradient overlays for better contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-transparent to-black/50" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accent via-black to-background" />
                    )}

                    {/* Animated pattern overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }} />
                    </div>
                </div>

                {/* Profile Content */}
                <motion.div
                    className="relative max-w-7xl mx-auto px-4 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row items-start gap-12">
                        {/* Profile Image with Border Effects */}
                        {data?.profileImage && (
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-accent via-white to-accent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 100%'],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                    }}
                                />
                                <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
                                    <Image
                                        src={data.profileImage}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Profile Info with Enhanced Typography and Layout */}
                        <div className="flex-1">
                            <div className="backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10">
                                <motion.div className="flex items-center gap-4 mb-6">
                                    <motion.h1
                                        className="text-6xl font-heading1 text-white"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {data?.name}
                                    </motion.h1>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="px-4 py-1 bg-accent/20 rounded-full text-accent text-sm">
                                            Deauth Verified
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {data?.description && (
                                    <motion.p
                                        className="text-xl text-gray-200 mb-8 leading-relaxed"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {data.description}
                                    </motion.p>
                                )}

                                {/* Enhanced Stats Display */}
                                {data?.followers !== null && (
                                    <motion.div
                                        className="flex gap-8 mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <motion.div
                                            className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl"
                                            whileHover={{ y: -2 }}
                                        >
                                            <span className="block text-3xl font-bold text-white mb-1">
                                                {data.followers}
                                            </span>
                                            <span className="text-gray-400 text-sm">Followers</span>
                                        </motion.div>
                                        <motion.div
                                            className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl"
                                            whileHover={{ y: -2 }}
                                        >
                                            <span className="block text-3xl font-bold text-white mb-1">
                                                {designs.length}
                                            </span>
                                            <span className="text-gray-400 text-sm">Designs</span>
                                        </motion.div>
                                        <motion.div
                                            className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl"
                                            whileHover={{ y: -2 }}
                                        >
                                            <span className="block text-3xl font-bold text-white mb-1">
                                                {data.totalSales || 0}
                                            </span>
                                            <span className="text-gray-400 text-sm">Sales</span>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Social Links with Enhanced Visual */}
                                {data?.socialMedia && data.socialMedia.length > 0 && (
                                    <div className="relative">
                                        <motion.div
                                            className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-white/20 rounded-xl blur-lg"
                                            animate={{
                                                opacity: [0.5, 0.8, 0.5],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                            }}
                                        />
                                        <div className="relative bg-black/20 backdrop-blur-sm p-4 rounded-xl">
                                            <SocialBar links={data.socialMedia} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Designs Section */}
            <div className="relative py-24">
                <motion.div
                    className="max-w-7xl mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Section Header */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <motion.div
                                className="h-[2px] w-12 bg-accent"
                                initial={{ width: 0 }}
                                animate={{ width: 48 }}
                                transition={{ delay: 0.5 }}
                            />
                            <motion.h2
                                className="text-5xl font-heading1 text-black"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Featured Designs
                            </motion.h2>
                            <motion.div
                                className="h-[2px] w-12 bg-accent"
                                initial={{ width: 0 }}
                                animate={{ width: 48 }}
                                transition={{ delay: 0.5 }}
                            />
                        </div>
                        <motion.p
                            className="text-gray-400 text-xl max-w-2xl text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Explore a collection of unique designs crafted with passion and creativity
                        </motion.p>
                    </div>

                    {/* Filters */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {[
                            { name: 'All Designs', count: designs.length },
                            { name: 'Popular', count: designs.filter(d => d.likes > 50).length },
                            { name: 'Recent', count: designs.filter(d => new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
                            { name: 'T-Shirts', count: designs.filter(d => d.category === 'tshirt').length },
                            { name: 'Hoodies', count: designs.filter(d => d.category === 'hoodie').length },
                        ].map((filter, index) => (
                            <motion.button
                                key={filter.name}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${activeFilter === filter.name
                                        ? 'bg-accent text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveFilter(filter.name)}
                            >
                                {filter.name}
                                <span className="ml-2 opacity-60">({filter.count})</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Grid Layout with Masonry Effect */}
                    <div className="relative">
                        <DesignGrid
                            designs={filteredDesigns}
                            onDesignClick={(design) => setSelectedDesign(design)}
                        />

                        {/* Background Elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            <motion.div
                                className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.5, 0.3, 0.5],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                }}
                            />
                        </div>
                    </div>

                    {/* Load More Section */}
                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex flex-col items-center">
                            <p className="text-gray-400 mb-4">
                                Showing {designs.length} out of {totalDesigns} designs
                            </p>
                            <div className="w-64 h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(designs.length / totalDesigns) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <Button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="bg-white/5 text-black hover:bg-white/10 rounded-full px-8"
                            >
                                {loading ? (
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : (
                                    'Load More Designs'
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            {/* Design Detail Sheet */}
            <DesignDetailSheet
                design={selectedDesign}
                onClose={() => setSelectedDesign(null)}
                onShare={handleShare}
            />
        </div>
    );
};



export default DesignerPublicProfile;