import { ReactNode } from 'react';
import { ShopProvider } from '../../context/ShopContext';
import { fetchShops } from '../../services/shopService';
import { ShopType } from '../../types/shop';

export default async function ShopLayout({children}: {children: ReactNode}) {
    const approvedShops = await fetchShops({ mode: 'once', isApproved: true }) as ShopType[];
    return (
        <ShopProvider initApprovedShops={approvedShops}>
            {children}
        </ShopProvider>
    )
};
