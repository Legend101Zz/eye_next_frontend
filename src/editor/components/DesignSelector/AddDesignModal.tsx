import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddDesignProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

const TagInput = ({ tags, setTags }: {
    tags: string[];
    setTags: (tags: string[]) => void
}) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = input.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
                setInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type and press Enter to add tags"
                className="mt-2"
            />
        </div>
    );
};

const AddDesignModal = ({ isOpen, onClose, onSubmit }: AddDesignProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg']
        },
        maxFiles: 1
    });

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
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('design', file);
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            tags.forEach(tag => {
                formData.append('tags[]', tag);
            });

            await onSubmit(formData);
            toast({
                title: "Success",
                description: "Design uploaded successfully",
            });
            handleClose();
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "Failed to upload design. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setTitle('');
        setDescription('');
        setTags([]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload New Design</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <ScrollArea className="max-h-[calc(100vh-200px)]">
                        <div className="space-y-4 pr-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter design title"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a description"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Label>Tags (Optional)</Label>
                                <TagInput tags={tags} setTags={setTags} />
                            </div>

                            <div>
                                <Label>Design File</Label>
                                <div
                                    {...getRootProps()}
                                    className={`
                                        mt-2 border-2 border-dashed rounded-lg p-4
                                        ${isDragActive ? 'border-primary' : 'border-border'}
                                        ${file ? 'border-green-500' : ''}
                                    `}
                                >
                                    <input {...getInputProps()} />
                                    {file ? (
                                        <div className="space-y-2">
                                            <div className="aspect-square max-h-48 relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute -top-2 -right-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground text-center">
                                                {file.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Drag & drop or click to browse
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !file || !title.trim()}
                        >
                            {isSubmitting ? "Uploading..." : "Upload Design"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDesignModal;