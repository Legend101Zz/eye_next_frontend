"use client";

import { Provider } from 'react-redux';
import store from '@/store/store';
import { SessionProvider } from "next-auth/react";

export default function StoreProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <Provider store={store}>
                {children}
            </Provider>
        </SessionProvider>
    );
}