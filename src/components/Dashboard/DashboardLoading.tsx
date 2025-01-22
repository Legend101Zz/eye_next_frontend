import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const DashboardLoading = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-8">
                <motion.div
                    className="relative w-32 h-32"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-t-accent border-r-accent/50 border-b-accent/30 border-l-accent/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner ring */}
                    <motion.div
                        className="absolute inset-8 border-4 border-accent/20 rounded-full"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Center dot */}
                    <motion.div
                        className="absolute inset-14 bg-accent rounded-full"
                        animate={{
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                <div className="text-center space-y-3">
                    <motion.h2
                        className="text-2xl font-heading1 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Loading Your Dashboard
                    </motion.h2>
                    <motion.p
                        className="text-white/60"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Please wait while we fetch your data...
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export const DashboardError = ({
    error,
    onRetry
}: {
    error: string;
    onRetry: () => void;
}) => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
            <motion.div
                className="max-w-md w-full mx-4 p-8 rounded-xl bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex flex-col items-center text-center gap-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </motion.div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-heading1 text-white">Failed to Load Dashboard</h2>
                        <p className="text-white/60">{error}</p>
                    </div>

                    <Button
                        onClick={onRetry}
                        className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 py-2 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};