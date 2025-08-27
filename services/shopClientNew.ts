import { supabase } from "../lib/supabase";
import { useQuery } from '@tanstack/react-query';
import camelcaseKeys from "camelcase-keys";
import { ShopType } from "../types/shop";

interface UseShopsOptions {
  onlyApproved?: boolean;
  initialData?: ShopType[];
}

export const useShops = ({ onlyApproved = true, initialData = [] }: UseShopsOptions = {}) => {
  return useQuery({
    queryKey: ['shops', onlyApproved ? 'approved' : 'all'],
    queryFn: async () => {
      let query = supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyApproved) {
        query = query.eq('isApproved', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((shop: any) => camelcaseKeys(shop, { deep: true }));
    },
    initialData
  });
};