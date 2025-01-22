'use client';

import { motion } from 'framer-motion';
import {
    TrendingUpIcon,
    UsersIcon,
    StarIcon,
    ShoppingBagIcon
} from 'lucide-react';

interface Stats {
    monthlyViews: number;
    totalFollowers: number;
    averageRating: number;
    totalSales: number;
}

interface StatCardProps {
    icon: JSX.Element;
    label: string;
    value: string | number;
    subtext?: string;
    delay: number;
}

const StatCard = ({ icon, label, value, subtext, delay }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="relative group"
    >
        <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
            animate={{
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
            }}
        />
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-white/60">{label}</p>
                    <div className="text-2xl font-bold text-white mt-1">{value}</div>
                    {subtext && (
                        <p className="text-xs text-white/40 mt-1">{subtext}</p>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

export const StatsSection = ({ stats }: { stats: Stats }) => {
    return (
        <div className="py-20 bg-gradient-to-b from-background to-black">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<TrendingUpIcon className="w-6 h-6 text-accent" />}
                        label="Monthly Views"
                        value={stats.monthlyViews.toLocaleString()}
                        subtext="Last 30 days"
                        delay={0.1}
                    />
                    <StatCard
                        icon={<UsersIcon className="w-6 h-6 text-accent" />}
                        label="Total Followers"
                        value={stats.totalFollowers.toLocaleString()}
                        delay={0.2}
                    />
                    <StatCard
                        icon={<StarIcon className="w-6 h-6 text-accent" />}
                        label="Average Rating"
                        value={stats.averageRating.toFixed(1)}
                        subtext="From verified purchases"
                        delay={0.3}
                    />
                    <StatCard
                        icon={<ShoppingBagIcon className="w-6 h-6 text-accent" />}
                        label="Total Sales"
                        value={stats.totalSales.toLocaleString()}
                        delay={0.4}
                    />
                </div>
            </div>
        </div>
    );
};