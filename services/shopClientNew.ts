import { supabase } from "../lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import camelcaseKeys from "camelcase-keys";
import { ShopType, ShopSubmittedType, ShopFormType, ShopAddSubmittedType } from "../types/shop";
import { generateSlug } from "../utils/autoSlug";

interface UseShopsOptions {
  onlyApproved?: boolean;
  initShopData?: ShopType[];
}

export const useShops = ({ onlyApproved = true, initShopData = [] }: UseShopsOptions = {}) => {
  return useQuery({
    queryKey: ['shops', onlyApproved ? 'approved' : 'all'],
    queryFn: async () => {
      let query = supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyApproved) {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((shop: any) => camelcaseKeys(shop, { deep: true }));
    },
    initialData: initShopData
  });
};

export const useAddShop = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, ShopAddSubmittedType | ShopFormType>({
    mutationFn: async (data: ShopAddSubmittedType | ShopFormType) => {
      let insertData: any = {};

      if (data.submittedByRole === 'user') {
        const slugInfo = generateSlug(data.submittedName);
        // by user
        insertData = {
          name_en: slugInfo.nameEn,
          name_zh: slugInfo.nameZh,
          slug: slugInfo.slug,
          alias: slugInfo.alias,
          submitted_name: data.submittedName,
          submitted_note: data.submittedNote,
          submitted_by: data.submittedBy,
          submitted_by_role: 'user',
          description: '',
          is_approved: false,
        };
      } else {
        // by admin
        insertData = {
          name_en: data.nameEn,
          name_zh: data.nameZh,
          slug: data.slug,
          alias: data.alias,
          submitted_by: data.submittedBy,
          submitted_by_role: 'admin',
          description: data.description ?? '',
          is_approved: true,
        };
      }

      const { data: shop, error } = await supabase
        .from('shops')
        .insert([insertData])
        .select('shop_id')
        .single();

      if (error) throw error;

      return shop.shop_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};