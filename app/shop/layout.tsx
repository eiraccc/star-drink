import { ReactNode } from 'react';
import { ShopProvider } from '../../context/ShopContext';
import { fetchShopsServer } from '../../services/shopServer';

export default async function ShopLayout({children}: {children: ReactNode}) {
    const approvedShops = await fetchShopsServer();
    return (
        <ShopProvider initApprovedShops={approvedShops}>
            {children}
        </ShopProvider>
    )
};
