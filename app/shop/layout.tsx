import { ShopProvider } from '../../context/ShopContext';

export default async function ShopLayout({children}: {children: React.ReactNode}) {
    return (
        <ShopProvider>
            {children}
        </ShopProvider>
    )
};
