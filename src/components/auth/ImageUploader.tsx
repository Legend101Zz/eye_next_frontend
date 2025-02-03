//@ts-nocheck
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

const ImageUploader = ({
    type,
    value,
    onChange,
    onRemove,
    error
}) => {
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            // Create URL for preview
            const previewUrl = URL.createObjectURL(file);
            onChange({ file, previewUrl });
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxSize: type === 'profile' ? 4 * 1024 * 1024 : 2 * 1024 * 1024,
        multiple: false,
        onDrop
    });

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove();
    };

    // Container styles based on type
    const containerStyles = type === 'profile'
        ? 'w-40 h-40 md:w-48 md:h-48 rounded-full'
        : 'w-full aspect-[16/9] rounded-lg';

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                {...getRootProps()}
                className={`
          relative flex flex-col items-center justify-center
          ${containerStyles}
          border-2 border-dashed 
          ${isDragActive ? 'border-accent bg-accent/10' : 'border-gray-500/30 hover:border-accent/50'}
          ${value ? 'border-none' : ''}
          transition-all duration-200
          cursor-pointer
          overflow-hidden
          group
        `}
            >
                <input {...getInputProps()} />

                {value ? (
                    <>
                        <Image
                            src={value.previewUrl}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Click to change</p>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors z-10"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-300">
                                {type === 'profile' ? 'Profile Photo' : 'Cover Image'}
                            </p>
                            <p className="text-xs text-gray-400">
                                Drop your image here or click to browse
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <p className="text-xs text-gray-400 text-center">
                {type === 'profile'
                    ? 'Upload a square profile photo (max 4MB)'
                    : 'Upload a cover image (max 2MB)'
                }
            </p>
        </div>
    );
};

export default ImageUploader;