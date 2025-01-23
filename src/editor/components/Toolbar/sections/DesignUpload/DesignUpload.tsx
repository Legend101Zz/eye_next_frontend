import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const DesignUpload = ({ getRootProps, getInputProps, isDragActive, designCount, activeView }) => {
    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">Design Upload</h3>
                    <Badge variant="secondary" className="text-xs">
                        {designCount} {designCount === 1 ? 'design' : 'designs'} on {activeView} view
                    </Badge>
                </div>

                {/* Testing Mode Alert */}
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-600 text-xs">
                        Preview mode: Designs added here are temporary and won&apos;t be saved
                    </AlertDescription>
                </Alert>
            </div>

            {/* Upload Drop Zone */}
            <Card
                {...getRootProps()}
                className={`
          p-6 border-2 border-dashed cursor-pointer transition-all duration-200
          hover:border-primary/50 hover:bg-primary/5
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3 text-sm">
                    <div className={`
            p-3 rounded-full bg-primary/10 transition-transform duration-200
            ${isDragActive ? 'scale-110' : ''}
          `}>
                        <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium text-foreground">
                            {isDragActive ? 'Drop your design here' : 'Upload your design'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isDragActive ?
                                'Release to add your design' :
                                'Drag and drop here, or click to select'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Tips Section */}
            {designCount > 0 && (
                <p className="text-xs text-muted-foreground text-center bg-muted/30 py-2 px-3 rounded-md">
                    💡 Tip: New designs are automatically offset for easier arrangement
                </p>
            )}
        </div>
    );
};

export default DesignUpload;