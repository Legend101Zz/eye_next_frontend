"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingOverlay } from "../AuthLoadingOverlay";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // Only redirect after the initial loading is complete
        // and we know the user is not authenticated
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <AuthLoadingOverlay isLoading={true} />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};