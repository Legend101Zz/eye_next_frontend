import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const gridVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

interface Design {
    _id: string;
    title: string;
    description?: string;
    designImages: Array<{ url: string }>;
    tags?: string[];
}

export const DesignGrid = ({
    designs,
    onDesignClick
}: {
    designs: Design[];
    onDesignClick: (design: Design) => void;
}) => {
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Helper function to determine grid area for each design
    const getGridArea = (index: number) => {
        if (!isLargeScreen) return undefined;

        // Create interesting grid layouts for first few items
        switch (index % 10) {
            case 0: return '1 / 1 / 3 / 3'; // Large item
            case 1: return '1 / 3 / 2 / 4'; // Small item right
            case 2: return '2 / 3 / 3 / 4'; // Small item right bottom
            case 3: return '3 / 1 / 4 / 2'; // Regular items
            default: return undefined;
        }
    };

    return (
        <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
        >
            {designs.map((design, index) => (
                <motion.div
                    key={design._id}
                    variants={itemVariants}
                    style={{ gridArea: getGridArea(index) }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer group
            ${index % 10 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                    onHoverStart={() => setHoveredId(design._id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => onDesignClick(design)}
                >
                    <Image
                        src={design.designImages[0]?.url || '/deauthCircleIcon2.png'}
                        alt={design.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <motion.div
                        initial={false}
                        animate={{
                            opacity: hoveredId === design._id ? 1 : 0,
                            y: hoveredId === design._id ? 0 : 20
                        }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                    >
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white font-heading1 text-2xl mb-2">{design.title}</h3>
                            {design.description && (
                                <p className="text-white/90 line-clamp-2 mb-4">{design.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {design.tags?.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute top-4 right-4 flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === design._id ? 1 : 0 }}
                    >
                        <button
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Add like functionality
                            }}
                        >
                            <HeartIcon className="w-5 h-5 text-white" />
                        </button>
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
};

// SVG Icon components
const HeartIcon = ({ className = "w-6 h-6" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
    </svg>
);