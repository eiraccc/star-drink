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
    listenAllShops,
} from '../utils/shopService';
import { useLocation } from 'react-router-dom';

interface ShopContextType {
  approvedShops: ShopType[];
  allShops: ShopType[];
  isLoadingApprovedShop: boolean;
  isLoadingAllShop: boolean;
  errorApproved: Error | null;
  errorAll: Error | null;
}

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [approvedShops, setApprovedShops] = useState<ShopType[]>([]);
    const [allShops, setAllShops] = useState<ShopType[]>([]);
    const [isLoadingApprovedShop, setIsLoadingApprovedShop] = useState(true);
    const [isLoadingAllShop, setIsLoadingAllShop] = useState(true);
    const [errorApproved, setErrorApproved] = useState<Error | null>(null);
    const [errorAll, setErrorAll] = useState<Error | null>(null);
    const location = useLocation();

    useEffect(() => {
        let unsubAll: (() => void) | null = null;
        let unsubApproved: (() => void) | null = null;

        if (location.pathname.startsWith('/admin')) {
            // admin page
            setIsLoadingAllShop(true);
            unsubAll = listenAllShops(
                (shops) => {
                    setAllShops(shops);
                    setIsLoadingAllShop(false);
                    setErrorAll(null);
                },
                (error) => {
                    setErrorAll(error);
                    setIsLoadingAllShop(false);
                }
            );
        } else {
            // not admin page
            setIsLoadingApprovedShop(true);
            unsubApproved = listenApprovedShops(
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
        }
        
        return () => {
            unsubApproved && unsubApproved();
            unsubAll && unsubAll();
        };
    }, []);

    return (
        <ShopContext.Provider
          value={{
            approvedShops,
            allShops,
            isLoadingApprovedShop,
            isLoadingAllShop,
            errorApproved,
            errorAll,
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