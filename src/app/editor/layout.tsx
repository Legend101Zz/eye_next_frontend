import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Design Editor",
    description: "Custom t-shirt design editor",
};

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>
                    {children}
                    <Toaster />
                </StoreProvider>
            </body>
        </html>
    );
}