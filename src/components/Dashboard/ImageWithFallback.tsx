import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

const ImageWithFallback = ({
    src,
    alt,
    width,
    height,
    className
}: ImageWithFallbackProps) => {
    const [error, setError] = useState(false);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <Image
                src={error ? '/deauthCircleIcon2.png' : src}
                alt={alt}
                width={width}
                height={height}
                className="object-cover transition-transform duration-300 hover:scale-105"
                onError={() => setError(true)}
            />
        </div>
    );
};

export default ImageWithFallback;