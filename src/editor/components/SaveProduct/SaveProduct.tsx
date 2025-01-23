import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEditor } from "../../store/editorStore";
import { Save } from 'lucide-react';

export const SaveProduct: React.FC = () => {
    const { createFinalProduct, designsByView } = useEditor();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = React.useState(false);

    const hasDesigns = Object.values(designsByView).some(designs => designs.length > 0);

    const handleSave = async () => {
        if (!hasDesigns) {
            toast({
                title: "No designs added",
                description: "Please add at least one design before saving",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsSaving(true);
            await createFinalProduct();
            toast({
                title: "Success",
                description: "Product saved successfully"
            });
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "Failed to save product. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Button
            onClick={handleSave}
            disabled={!hasDesigns || isSaving}
            className="w-full gap-2"
        >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Product"}
        </Button>
    );
};