"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesignerRoute } from "@/components/auth/ProtectedRoutes/DesignerRoute";
import { getDesignDetails, type DesignDetails } from "@/helpers/api/designerApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PlusIcon, ImageIcon, ExternalLinkIcon, HeartIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Wrapper from "@/components/Wrapper";

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const DesignDetailsPage = ({ params }: { params: { designId: string } }) => {
    const [design, setDesign] = useState<DesignDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchDesignDetails = async () => {
            try {
                const data = await getDesignDetails(params.designId);
                setDesign(data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load design details",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDesignDetails();
    }, [params.designId, toast]);

    const handleCreateProduct = () => {
        router.push(`/editor?designId=${params.designId}`);
    };

    if (loading) {
        return <LoadingState />;
    }

    if (!design) {
        return <ErrorState />;
    }

    return (
        <DesignerRoute>
            <div className="min-h-screen bg-background">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="pt-24"
                >
                    <Wrapper>
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Design Image Section */}
                            <motion.div
                                className="relative aspect-square rounded-2xl overflow-hidden bg-black/5"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src={design.designImage[0]?.url || "/placeholder.png"}
                                    alt={design.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>

                            {/* Design Info Section */}
                            <div className="space-y-8">
                                <div>
                                    <motion.h1
                                        className="text-4xl font-heading1 mb-4"
                                        variants={fadeIn}
                                    >
                                        {design.title}
                                    </motion.h1>
                                    <motion.p
                                        className="text-gray-600"
                                        variants={fadeIn}
                                    >
                                        {design.description}
                                    </motion.p>
                                </div>

                                {/* Stats */}
                                <motion.div
                                    className="grid grid-cols-3 gap-4"
                                    variants={fadeIn}
                                >
                                    <div className="bg-black/90 text-white rounded-xl p-4">
                                        <HeartIcon className="mb-2 text-accent" />
                                        <div className="text-2xl font-bold">{design.likes}</div>
                                        <div className="text-sm text-gray-400">Likes</div>
                                    </div>
                                    <div className="bg-black/90 text-white rounded-xl p-4">
                                        <EyeOpenIcon className="mb-2 text-accent" />
                                        <div className="text-2xl font-bold">{design.appliedCount}</div>
                                        <div className="text-sm text-gray-400">Applications</div>
                                    </div>
                                    <div className="bg-black/90 text-white rounded-xl p-4">
                                        <div className="mb-2 text-accent">
                                            {design.isVerified ? "✓" : "!"}
                                        </div>
                                        <div className="text-2xl font-bold">Status</div>
                                        <div className="text-sm text-gray-400">
                                            {design.isVerified ? "Verified" : "Pending"}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tags */}
                                <motion.div
                                    className="flex flex-wrap gap-2"
                                    variants={fadeIn}
                                >
                                    {design.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-black/5 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </motion.div>

                                {/* Products Section */}
                                <motion.div variants={fadeIn} className="space-y-4">
                                    <h2 className="text-2xl font-heading1">Products Using This Design</h2>
                                    {design.finalProduct && design.finalProduct.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {design.finalProduct.map((product, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-black/5 p-4 rounded-xl space-y-2"
                                                >
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-gray-600">{product.category}</div>
                                                    <div className="text-accent font-bold">${product.price}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-black/90 rounded-xl p-8 text-center text-white">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-accent" />
                                            <h3 className="text-xl font-heading1 mb-2">No Products Yet</h3>
                                            <p className="text-gray-400 mb-6">
                                                Start creating products with this design to reach more customers.
                                            </p>
                                            <Button
                                                onClick={handleCreateProduct}
                                                className="bg-accent text-white hover:bg-accent/90"
                                            >
                                                <PlusIcon className="mr-2" />
                                                Create Product
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Creation Info */}
                                <motion.div
                                    variants={fadeIn}
                                    className="text-sm text-gray-500"
                                >
                                    Created {new Date(design.createdAt).toLocaleDateString()}
                                    {design.updatedAt !== design.createdAt &&
                                        ` • Updated ${new Date(design.updatedAt).toLocaleDateString()}`
                                    }
                                </motion.div>
                            </div>
                        </div>
                    </Wrapper>
                </motion.div>
            </div>
        </DesignerRoute>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-background pt-24">
        <Wrapper>
            <div className="animate-pulse space-y-8">
                <div className="h-96 bg-black/5 rounded-2xl" />
                <div className="space-y-4">
                    <div className="h-8 w-2/3 bg-black/5 rounded-lg" />
                    <div className="h-24 bg-black/5 rounded-lg" />
                </div>
            </div>
        </Wrapper>
    </div>
);

const ErrorState = () => (
    <div className="min-h-screen bg-background pt-24">
        <Wrapper>
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-heading1">Design Not Found</h2>
                <p className="text-gray-600">The design you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
                <Button asChild>
                    <Link href="/profile/DesignerDashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </Wrapper>
    </div>
);

export default DesignDetailsPage;