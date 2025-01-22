import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from 'react-dropzone';
import { PlusIcon, ImageIcon, UploadIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from "@/components/ui/use-toast";

interface AddDesignProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (designData: FormData) => Promise<void>;
}

const PreviewImage = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative group"
    >
        <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-64 object-contain rounded-lg"
        />
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full
                opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Cross2Icon className="w-4 h-4" />
        </motion.button>
    </motion.div>
);

const TagPill = ({ text, onRemove }: { text: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-sm">
        {text}
        <button
            onClick={onRemove}
            className="hover:text-red-500"
        >
            <Cross2Icon className="w-3 h-3" />
        </button>
    </span>
);

const UploadProgress = ({ progress }: { progress: number }) => (
    <div className="relative w-full h-2 bg-black/10 rounded-full overflow-hidden">
        <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
        />
    </div>
);

const AddDesignModal = ({ isOpen, onClose, onSubmit }: AddDesignProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle comma, Enter, or space to add tag
        if ([',', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
        // Handle backspace to edit last tag
        else if (e.key === 'Backspace' && !tagInput) {
            e.preventDefault();
            const updatedTags = [...tags];
            updatedTags.pop();
            setTags(updatedTags);
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide a title and upload a design.",
                variant: "destructive"
            });
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('design', file);
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            console.log('FormData2', file, title, description, tags);
            // Add default tags if none provided
            const finalTags = tags.length > 0 ? tags : ['design', 'art'];
            finalTags.forEach(tag => {
                formData.append('tags[]', tag);
            });

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            await onSubmit(formData);

            setUploadProgress(100);
            clearInterval(progressInterval);

            toast({
                title: "Success!",
                description: "Your design has been uploaded successfully.",
            });

            setTimeout(() => {
                onClose();
                resetForm();
            }, 1000);

        } catch (error) {
            toast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Failed to upload design",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFile(null);
        setTitle('');
        setDescription('');
        setTags([]);
        setTagInput('');
        setUploadProgress(0);
    };

    const isSubmitDisabled = uploading || !file || !title.trim();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-black/95 backdrop-blur-xl border-accent/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading1 text-white mb-4">
                        Add New Design
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title" className="text-base font-medium text-white">
                                Design Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 bg-white/5 border-accent/20 focus:border-accent text-white"
                                placeholder="Enter a title for your design"
                                disabled={uploading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-base font-medium text-white">
                                Description (Optional)
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 bg-white/5 border-accent/20 focus:border-accent text-white"
                                placeholder="Add a description for your design"
                                disabled={uploading}
                            />
                        </div>

                        <div>
                            <Label className="text-base font-medium text-white mb-2 block">
                                Tags
                            </Label>
                            <div className="min-h-[42px] p-2 bg-white/5 border border-accent/20 rounded-md focus-within:border-accent flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <TagPill
                                        key={index}
                                        text={tag}
                                        onRemove={() => removeTag(index)}
                                    />
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    className="flex-1 min-w-[60px] bg-transparent outline-none text-white"
                                    placeholder={tags.length === 0 ? "Add tags (press Enter or comma to add)" : ""}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-base font-medium text-white mb-2 block">
                                Upload Design
                            </Label>
                            <div
                                {...getRootProps()}
                                className={`
                                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                                    transition-all duration-200 bg-white/5
                                    ${isDragActive ? 'border-accent bg-accent/5' : 'border-accent/20'}
                                    ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-accent hover:bg-accent/5'}
                                `}
                            >
                                <input {...getInputProps()} />
                                <AnimatePresence mode="wait">
                                    {file ? (
                                        <PreviewImage file={file} onRemove={() => setFile(null)} />
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="space-y-4"
                                        >
                                            <motion.div
                                                animate={{ y: isDragActive ? -10 : 0 }}
                                                className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto"
                                            >
                                                <ImageIcon className="w-8 h-8 text-accent" />
                                            </motion.div>
                                            <div className="text-white">
                                                {isDragActive ? (
                                                    <p className="font-medium text-accent">Drop your design here</p>
                                                ) : (
                                                    <>
                                                        <p className="font-medium">
                                                            Drag & drop your design here, or <span className="text-accent">browse</span>
                                                        </p>
                                                        <p className="text-sm mt-2 text-gray-400">
                                                            Supports PNG, JPG or GIF up to 10MB
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <UploadProgress progress={uploadProgress} />
                        </motion.div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={uploading}
                            className="border-accent/20 hover:border-accent text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`bg-accent hover:bg-accent/90 text-white
                                transition-all duration-300 ${uploading ? 'opacity-50' : ''}`}
                        >
                            {uploading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Upload Design
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDesignModal;