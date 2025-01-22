import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import ImageWithFallback from './ImageWithFallback';

interface DashboardCardProps {
	mainImageUrl?: string;
	title?: string;
	designId?: string;
	description?: string;
}

const LoadingCard = () => {
	return (
		<div className="space-y-4 p-4 bg-black/5 rounded-lg">
			<Skeleton className="w-full h-[330px] rounded-lg" />
			<div className="space-y-2">
				<Skeleton className="w-3/4 h-6 rounded-md" />
				<div className="flex justify-between">
					<Skeleton className="w-24 h-4 rounded-md" />
					<Skeleton className="w-24 h-4 rounded-md" />
				</div>
			</div>
		</div>
	);
};

const DashboardProductCard = ({
	mainImageUrl,
	title = 'Untitled Design',
	designId,
	description
}: DashboardCardProps) => {
	const [isHovered, setIsHovered] = useState(false);

	if (!mainImageUrl) return <LoadingCard />;

	return (
		<motion.div
			whileHover={{ y: -5 }}
			className="group relative bg-black/5 rounded-xl overflow-hidden"
		>
			<Link href={`/designer/designs/${designId}`}>
				<div className="aspect-square relative">
					<Image
						src={mainImageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
					<h3 className="font-heading1 text-lg mb-1 truncate">{title}</h3>
					{description && (
						<p className="text-sm text-white/80 line-clamp-2">{description}</p>
					)}
				</div>
			</Link>
		</motion.div>
	);
};

export default DashboardProductCard;