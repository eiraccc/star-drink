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
    fetchShops,
} from '../services/shopClient';

interface ShopContextType {
  approvedShops: ShopType[];
  isLoadingApprovedShop: boolean;
  errorApproved: Error | null;
}

export const ShopProvider = ({
  children,
  initApprovedShops = [],
}: {
  children: ReactNode,
  initApprovedShops: ShopType[]
}) => {
    const [approvedShops, setApprovedShops] = useState<ShopType[]>(initApprovedShops);
    const [isLoadingApprovedShop, setIsLoadingApprovedShop] = useState(!initApprovedShops.length);
    const [errorApproved, setErrorApproved] = useState<Error | null>(null);

    // useEffect(() => {
    //   // 啟動即時監聽
    //   let unsubscribe: (() => void) | undefined;
  
    //   (async () => {
    //     const sub = await fetchShops({
    //       mode: 'subscribe',
    //       isApproved: true,
    //       callback: (shops) => {
    //         setApprovedShops(shops);
    //         setIsLoadingApprovedShop(false);
    //         setErrorApproved(null);
    //       },
    //       errorCallback: (err) => {
    //         setErrorApproved(err);
    //         setIsLoadingApprovedShop(false);
    //       },
    //     });
  
    //     if (typeof sub === 'function') {
    //       unsubscribe = sub;
    //     }
    //   })();
  
    //   return () => {
    //     if (unsubscribe) unsubscribe();
    //   };
    // }, []);
  

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