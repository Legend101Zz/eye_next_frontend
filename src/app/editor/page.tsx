"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MobileWarning } from './components/Mobile_Warning';
import { EditorHeader } from './components/Editor_Header';
import { DesignerRoute } from "@/components/auth/ProtectedRoutes/DesignerRoute";

// Import Editor component dynamically to avoid SSR issues
const Editor = dynamic(
  () => import('@/editor/components/Editor/Editor').then((mod) => mod.Editor),
  { ssr: false }
);

export default function EditorPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    if (isMobile) {
        return <MobileWarning />;
    }

    return (
        <DesignerRoute>
            <EditorHeader />
            <div className="container mx-auto py-4">
                <Editor />
            </div>
        </DesignerRoute>
    );
}