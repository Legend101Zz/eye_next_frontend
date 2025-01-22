'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface Review {
    id: string;
    customerName: string;
    customerImage: string;
    rating: number;
    comment: string;
    productName: string;
    date: string;
}

interface ReviewsProps {
    reviews: Review[];
}

const ReviewCard = ({ review }: { review: Review }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-4 h-4 ${index < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                            }`}
                    />
                ))}
            </div>

            {/* Review Comment */}
            <p className="text-gray-300 mb-6 line-clamp-4">
                "{review.comment}"
            </p>

            {/* Customer Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src={review.customerImage}
                            alt={review.customerName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-white font-medium">{review.customerName}</p>
                        <p className="text-sm text-gray-400">on {review.productName}</p>
                    </div>
                </div>
                <span className="text-sm text-gray-400">{review.date}</span>
            </div>
        </motion.div>
    );
};

export const ReviewsSection = ({ reviews }: ReviewsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-black to-background"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-heading1 text-white mb-4">
                        What Customers Say
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Hear from people who have purchased and used our designs
                    </p>
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};