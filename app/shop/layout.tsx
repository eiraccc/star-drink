import React from 'react';
import { ShopProvider } from '../../src/context/ShopContext';

export default async function ShopLayout({children}: {children: React.ReactNode}) {
    return (
        <ShopProvider>
            {children}
        </ShopProvider>
    )
};
