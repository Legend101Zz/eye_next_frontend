"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingOverlay } from "../AuthLoadingOverlay";
import { useEffect } from "react";

export const DesignerRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isAuthenticated, isDesigner, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (!isDesigner) {
                // If user is logged in but not a designer, redirect to designer registration
                router.push('/auth/designer');
            }
        }
    }, [isAuthenticated, isDesigner, isLoading, router]);

    if (isLoading) {
        return <AuthLoadingOverlay isLoading={true} />;
    }

    // Don't render content if not authenticated or not a designer
    if (!isAuthenticated || !isDesigner) {
        return null;
    }

    return <>{children}</>;
};