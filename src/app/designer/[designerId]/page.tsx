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
import { toast } from '@/components/ui/use-toast';


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



const DesignerProfile = ({ params }) => {
    const { isPrivate, data, designs, loading, error } = usePublicProfile(params.designerId);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All Designs');

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (isPrivate) return <PrivateProfileState designerName={data?.name || 'Designer'} />;

    const handleShare = async (design = null) => {
        console.log('Sharing:', design ? 'Design' : 'Profile');

        try {
            // Get base URL - replace localhost with production URL in deployment
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

            // Construct designer profile URL
            const designerProfileUrl = `${baseUrl}/designer/${params.designerId}`;

            // Construct share data
            const shareData = {
                title: design
                    ? `${design.title} by ${data?.name} on Deauth`
                    : `${data?.name}'s Designer Profile on Deauth`,
                text: design
                    ? `Check out this amazing design "${design.title}" by ${data?.name}`
                    : `Discover amazing designs by ${data?.name} on Deauth`,
                url: design
                    ? `${designerProfileUrl}?design=${design._id}`
                    : designerProfileUrl
            };

            // Add image if available
            const imageUrl = design?.designImages?.[0]?.url || data?.profileImage || '/deauthCircleIcon.png';

            // Check if Web Share API Level 2 is available (supports sharing files)
            if (navigator.canShare && navigator.canShare({ files: [] })) {
                try {
                    // Fetch and share image
                    const imageResponse = await fetch(imageUrl);
                    const imageBlob = await imageResponse.blob();
                    const imageFile = new File([imageBlob], 'deauth-share.png', { type: 'image/png' });

                    await navigator.share({
                        ...shareData,
                        files: [imageFile]
                    });
                    return;
                } catch (error) {
                    console.log('Image share failed, falling back to URL share');
                    // Fall through to regular share
                }
            }

            // Try regular Web Share API
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            // Fallback to clipboard
            await navigator.clipboard.writeText(shareData.url);

            // Show success toast
            toast({
                title: "Link Copied!",
                description: "Share link has been copied to your clipboard",
                duration: 3000,
            });

        } catch (err) {
            console.error('Error sharing:', err);

            // Show error toast
            toast({
                title: "Sharing Failed",
                description: "There was an error sharing this content",
                variant: "destructive",
                duration: 3000,
            });
        }
    };




    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-base-300 to-base-200">
                {/* Cover Section */}
                <div className="relative h-72 md:h-96">
                    {data?.coverImage ? (
                        <div className="relative h-full">
                            <Image
                                src={data.coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-300/50 to-base-300" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-base-300 to-base-200" />
                    )}
                </div>

                {/* Profile Section */}
                <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
                    <motion.div
                        className="bg-base-300/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile Image with Glow Effect */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-white opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-700" />
                                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/10">
                                    <Image
                                        src={data?.profileImage || '/deauthCircleIcon.png'}
                                        alt={data?.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="space-y-6">
                                    {/* Name and Badges */}
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <h1 className="text-4xl md:text-5xl font-heading1 text-white">{data?.name}</h1>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-accent text-black text-sm rounded-full font-medium">
                                                Verified
                                            </span>
                                            <span className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full font-medium">
                                                Pro Designer
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <Button
                                            size="lg"
                                            className="bg-accent hover:bg-accent/90 text-black font-heading1 rounded-full px-8"
                                        >
                                            Follow Artist
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="rounded-full bg-white hover:bg-base-200 font-heading1"
                                            onClick={() => handleShare()}
                                        >
                                            Share Profile
                                        </Button>
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-3 gap-4 max-w-2xl">
                                        {[
                                            { label: 'Designs', value: designs.length },
                                            { label: 'Followers', value: data?.followers || 0 },
                                            { label: 'Sales', value: data?.totalSales || 0 }
                                        ].map((stat) => (
                                            <motion.div
                                                key={stat.label}
                                                className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5"
                                                whileHover={{ y: -2 }}
                                            >
                                                <span className="block text-3xl font-bold text-white mb-1">
                                                    {stat.value.toLocaleString()}
                                                </span>
                                                <span className="text-white/60 text-sm">{stat.label}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section with Gradient Border */}
                        {data?.description && (
                            <div className="mt-8 relative rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-white/5 to-accent/20" />
                                <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-xl">
                                    <p className="text-white/80 text-lg leading-relaxed">{data.description}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Designs Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-heading1 text-white mb-4">Featured Designs</h2>
                        <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6" />
                        <p className="text-white/60 text-xl max-w-2xl mx-auto">
                            Explore {data?.name}'s unique collection of designs
                        </p>
                    </motion.div>

                    {/* Design Filters */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-3 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {['All Designs', 'Popular', 'Recent', 'T-Shirts', 'Hoodies'].map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? 'default' : 'outline'}
                                size="lg"
                                className={cn(
                                    'rounded-full font-medium transition-all duration-300',
                                    activeFilter === filter
                                        ? 'bg-accent text-black hover:bg-accent/90'
                                        : 'bg-base-300/50 text-white/70 hover:bg-base-300/80 hover:text-white'
                                )}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </motion.div>

                    {/* Designs Grid with Enhanced Hover Effects */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        {designs.map((design, index) => (
                            <motion.div
                                key={design._id}
                                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-base-300"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    show: { opacity: 1, scale: 1 }
                                }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedDesign(design)}
                            >
                                <Image
                                    src={design.designImages[0]?.url || '/placeholder.png'}
                                    alt={design.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-white font-heading1 text-xl mb-2">
                                            {design.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            {design.tags?.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Load More Section */}
                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            size="lg"
                            className="bg-accent hover:bg-accent/90 text-black font-heading1 rounded-full px-8"
                        >
                            Load More Designs
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Selected Design Modal */}
            <AnimatePresence>
                {selectedDesign && (
                    <DesignDetailSheet
                        design={selectedDesign}
                        onClose={() => setSelectedDesign(null)}
                        onShare={() => handleShare(selectedDesign)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DesignerProfile;