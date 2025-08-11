'use client';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { ShopType} from '../types/shop';
import {
    listenApprovedShops,
} from '../utils/shopService';

interface ShopContextType {
  approvedShops: ShopType[];
  isLoadingApprovedShop: boolean;
  errorApproved: Error | null;
}

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [approvedShops, setApprovedShops] = useState<ShopType[]>([]);
    const [isLoadingApprovedShop, setIsLoadingApprovedShop] = useState(false);
    const [errorApproved, setErrorApproved] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoadingApprovedShop(true);
        const unsubApproved = listenApprovedShops(
            (shops) => {
                setApprovedShops(shops);
                setIsLoadingApprovedShop(false);
                setErrorApproved(null);
            },
            (err) => {
                setErrorApproved(err);
                setIsLoadingApprovedShop(false);
            }
        );
        
    
        return () => unsubApproved();
    }, []);

    return (
        <ShopContext.Provider
          value={{
            approvedShops,
            isLoadingApprovedShop,
            errorApproved,
          }}
        >
          {children}
        </ShopContext.Provider>
    );
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};