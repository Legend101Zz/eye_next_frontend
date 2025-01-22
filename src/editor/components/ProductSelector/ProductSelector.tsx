import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEditor } from "../../store/editorStore";

export const ProductSelector: React.FC = () => {
    const {
        availableProducts,
        activeProductId,
        setActiveProduct,
        garmentColor,
        setGarmentColor
    } = useEditor();

    const activeProduct = availableProducts.find(p => p.id === activeProductId);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Product Type</Label>
                <Select
                    value={activeProductId || ''}
                    onValueChange={setActiveProduct}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {activeProduct && (
                <div className="space-y-2">
                    <Label>Color</Label>
                    <Select
                        value={garmentColor}
                        onValueChange={setGarmentColor}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                            {activeProduct.colors.map((color) => (
                                <SelectItem key={color} value={color}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-200"
                                            style={{ backgroundColor: color }}
                                        />
                                        {color}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
};