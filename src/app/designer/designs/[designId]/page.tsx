"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DesignerRoute } from '@/components/auth/ProtectedRoutes/DesignerRoute';
import { getFilteredProducts } from '@/helpers/api/productApis';
import { getDesignDetails } from '@/helpers/api/designerApi';
import { useToast } from '@/components/ui/use-toast';
import Wrapper from '@/components/Wrapper';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import {
    PlusIcon, ImageIcon, ExternalLinkIcon, HeartIcon,
    EyeOpenIcon, ChevronDownIcon, ChevronUpIcon
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BarChartComponent from '@/components/Dashboard/analytics/BarCharts';
import LineChartComponent from '@/components/Dashboard/analytics/LineChart';

const ProductVariantCard = ({ variant, showDetails = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/5 rounded-xl p-4 space-y-4"
    >
        <div className="grid grid-cols-2 gap-4">
            {/* Front Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                    src={variant.images.front}
                    alt="Front view"
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
                    Front
                </div>
            </div>

            {/* Back Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                    src={variant.images.back}
                    alt="Back view"
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
                    Back
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="font-heading1 text-lg">{variant.productName}</h3>
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-${variant.color}`} />
                <span className="text-sm capitalize">{variant.color}</span>
            </div>

            {showDetails && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(variant.stock).map(([size, quantity]) => (
                        <div key={size} className="bg-black/10 rounded-lg p-2 text-center">
                            <div className="text-sm font-bold">{size}</div>
                            <div className="text-xs text-gray-600">{quantity} units</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </motion.div>
);

const ProductGroup = ({ group, expanded, onToggle }) => {
    // Prepare data for charts
    const stockData = Object.entries(group.variants[0].stock).map(([size, quantity]) => ({
        name: size,
        value: quantity
    }));

    // Mock sales data - in real app, this would come from API
    const salesData = [
        { name: "Jan", value: 65 },
        { name: "Feb", value: 45 },
        { name: "Mar", value: 85 },
        { name: "Apr", value: 35 },
        { name: "May", value: 55 }
    ];

    return (
        <div className="border border-accent/20 rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full p-4 bg-black/90 text-white flex justify-between items-center"
            >
                <div>
                    <h3 className="font-heading1 text-lg">{group.name}</h3>
                    <p className="text-sm text-gray-400">{group.variants.length} variants • {group.gender}</p>
                </div>
                {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white space-y-6"
                >
                    {/* Analytics Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-black/5 p-4 rounded-xl">
                            <h4 className="font-heading1 mb-4">Stock Distribution</h4>
                            <BarChartComponent data={stockData} />
                        </div>
                        <div className="bg-black/5 p-4 rounded-xl">
                            <h4 className="font-heading1 mb-4">Sales Trend</h4>
                            <LineChartComponent data={salesData} />
                        </div>
                    </div>

                    {/* Variants Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.variants.map((variant, idx) => (
                            <ProductVariantCard
                                key={idx}
                                variant={variant}
                                showDetails={true}
                            />
                        ))}
                    </div>

                    {/* Design Placements */}
                    <div className="bg-black/5 p-4 rounded-xl">
                        <h4 className="font-heading1 mb-4">Design Placements</h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.designs.map((design, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="font-medium">{design.designName}</div>
                                    <div className="text-sm text-gray-600">by {design.designerName}</div>
                                    <div className="mt-2 flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-accent/10 rounded-full">
                                            {design.position}
                                        </span>
                                        <span className="px-2 py-1 bg-accent/10 rounded-full">
                                            Scale: {(design.scale * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const ProductsList = ({ products }) => {
    const [expandedGroups, setExpandedGroups] = useState(new Set());

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    if (!products.length) {
        return (
            <div className="text-center py-12 bg-black/5 rounded-xl">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {products.map(product => (
                <div key={product.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-heading1">{product.productName}</h2>
                            <div className="flex gap-2">
                                {product.tags.map((tag, idx) => (
                                    <span key={idx} className="text-sm px-2 py-1 bg-accent/10 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {product.designGroups.map(group => (
                            <ProductGroup
                                key={group.id}
                                group={group}
                                expanded={expandedGroups.has(group.id)}
                                onToggle={() => toggleGroup(group.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const DesignDetailsPage = ({ params }: { params: { designId: string } }) => {
    const [design, setDesign] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const designData = await getDesignDetails(params.designId);
                setDesign(designData);

                // Fetch products using the design
                const productsData = await getFilteredProducts({ designId: params.designId });
                console.log('productsData', productsData)
                setProducts(productsData?.products
                    || []);
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

        fetchData();
    }, [params.designId]);

    const handleCreateProduct = () => {
        if (!design?.isVerified) {
            toast({
                title: "Cannot Create Product",
                description: "This design needs to be verified before creating products",
                variant: "destructive"
            });
            return;
        }
        router.push(`/editor?designId=${params.designId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24">
                <Wrapper>
                    <div className="space-y-8">
                        <div className="h-96 bg-black/5 animate-pulse rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-8 w-2/3 bg-black/5 animate-pulse rounded-lg" />
                            <div className="h-24 bg-black/5 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </Wrapper>
            </div>
        );
    }

    if (!design) {
        return (
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
    }

    return (
        <DesignerRoute>
            <div className="min-h-screen bg-background">
                <Wrapper className="pt-24">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Design Preview Section */}
                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/5 group">
                                <Image
                                    src={design.designImage[0]?.url || "/placeholder.png"}
                                    alt={design.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    priority
                                />
                                {!design.isVerified && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="text-white text-center p-6 bg-black/80 rounded-lg">
                                            <h3 className="text-xl font-bold mb-2">Pending Verification</h3>
                                            <p>This design needs to be verified before use</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Tags */}
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm ${design.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {design.isVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                                {design.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Design Info Section */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-heading1 mb-4">{design.title}</h1>
                                <p className="text-gray-600">{design.description}</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
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
                                    <div className="text-2xl font-bold">
                                        {products.length}
                                    </div>
                                    <div className="text-sm text-gray-400">Products</div>
                                </div>
                            </div>

                            {/* Create Product Section */}
                            {design.isVerified ? (
                                <div className="bg-gradient-to-r from-accent to-accent/80 rounded-xl p-8 text-white">
                                    <h3 className="text-2xl font-heading1 mb-4">Create New Product</h3>
                                    <p className="mb-6">Apply this design to our mockups and start selling your artwork</p>
                                    <Button
                                        onClick={handleCreateProduct}
                                        className="bg-white text-accent hover:bg-white/90"
                                    >
                                        <PlusIcon className="mr-2" />
                                        Create Product
                                    </Button>
                                </div>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full bg-accent/50 cursor-not-allowed">
                                            <PlusIcon className="mr-2" />
                                            Create Product
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Design Not Verified</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This design needs to be verified by our team before you can create products with it.
                                                This usually takes 24-48 hours. We&apos;ll notify you once it&apos;s approved.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction>Okay</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            {/* Products List */}
                            <div className="mt-12">
                                <h2 className="text-3xl font-heading1 mb-6">Products & Analytics</h2>
                                <ProductsList products={products} />
                            </div>

                            <div className="text-sm text-gray-500">
                                Created {new Date(design.createdAt).toLocaleDateString()}
                                {design.updatedAt !== design.createdAt &&
                                    ` • Updated ${new Date(design.updatedAt).toLocaleDateString()}`
                                }
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </DesignerRoute>
    );
};

export default DesignDetailsPage;