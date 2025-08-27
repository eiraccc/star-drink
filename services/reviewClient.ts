import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import camelcaseKeys from 'camelcase-keys';
import { DrinkReviewType, DrinkReviewFormType } from '../types/drinkReview';

export const useReviews = ({
  shopId,
  initReviewData = [],
}: {
  shopId?: string;
  initReviewData?: DrinkReviewType[];
}) => {
  return useQuery({
    queryKey: shopId ? ['reviews', shopId] : ['reviews', 'all'],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`*, drinks!inner(drink_name), shops!inner(name_en), users!inner(user_name)`)
        .order('created_at', { ascending: false });

      if (shopId) query = query.eq('shop_id', shopId);

      const { data, error } = await query;
      console.log('api', data)
      if (error) throw error;

      const formatted = data.map((r: any) =>
        camelcaseKeys(
          {
            ...r,
            drinkName: r.drinks.drink_name,
            shopName: r.shops.name_en,
            userName: r.users.user_name
          },
          { deep: true }
        )
      );

      formatted.forEach(r => {
        delete r.drinks;
        delete r.shops;
      });

      return formatted;
    },
    initialData: initReviewData,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation<DrinkReviewType, Error, DrinkReviewFormType>({
    mutationFn: async (data: DrinkReviewFormType) => {
      const userId = 'c8006b65-e892-455d-829b-ed4cf4035374';
      const { shopId, drinkName, rating, sugar, ice, comment, toppings } = data;

      // 1. get matched drink_id
      let { data: drink, error: drinkError } = await supabase
        .from('drinks')
        .select('drink_id')
        .eq('shop_id', shopId)
        .eq('drink_name', drinkName)
        .single();

      if (drinkError && drinkError.code !== 'PGRST116') throw drinkError;

      // 2. if no drink, add to drink table
      if (!drink) {
        console.log('!drink', { shop_id: shopId, drink_name: drinkName });
        const { data: newDrink, error: newDrinkError } = await supabase
          .from('drinks')
          .insert([{ shop_id: shopId, drink_name: drinkName }])
          .select()
          .single();

        if (newDrinkError) throw newDrinkError;
        drink = newDrink;
      }

      // 3. add review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert([
          {
            drink_id: drink?.drink_id || '',
            shop_id: shopId,
            user_id: userId,
            rating,
            sugar,
            ice,
            comment,
            toppings,
            review_type: 'personal',
          },
        ])
        .select(
          `
          *,
          drinks!inner(drink_name),
          shops!inner(name_en),
          users!inner(user_name)
        `
        )
        .single();

      if (reviewError) throw reviewError;

      // 4. camelCase
      const formatted = camelcaseKeys(
        {
          ...review,
          drinkName: review.drinks?.drink_name ?? '',
          shopName: review.shops?.name_en ?? '',
          userName: review.users?.user_name ?? ''
            
        },
        { deep: true }
      );

      delete formatted.drinks;
      delete formatted.shops;

      return formatted;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'all'],
      });
    },
  });
};

export const useEditReview = () => {
  const queryClient = useQueryClient();

  return useMutation<DrinkReviewType, Error, { reviewId: string; data: DrinkReviewFormType }>({
    mutationFn: async ({ reviewId, data }) => {
      const userId = 'c8006b65-e892-455d-829b-ed4cf4035374';
      const { shopId, drinkName, rating, sugar, ice, comment, toppings } = data;

      // 1. get matched drink_id
      let { data: drink, error: drinkError } = await supabase
        .from('drinks')
        .select('drink_id')
        .eq('shop_id', shopId)
        .eq('drink_name', drinkName)
        .single();

      if (drinkError && drinkError.code !== 'PGRST116') throw drinkError;

      // 2. if no drink, add to drink table
      if (!drink) {
        const { data: newDrink, error: newDrinkError } = await supabase
          .from('drinks')
          .insert([{ shop_id: shopId, drink_name: drinkName }])
          .select()
          .single();

        if (newDrinkError) throw newDrinkError;
        drink = newDrink;
      }

      // 3. update review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .update({
          drink_id: drink?.drink_id || '',
          shop_id: shopId,
          user_id: userId,
          rating,
          sugar,
          ice,
          comment,
          toppings,
          review_type: 'personal',
        })
        .eq('review_id', reviewId)
        .select(
          `
          *,
          drinks!inner(drink_name),
          shops!inner(name_en),
          users!inner(user_name)
        `
        )
        .single();

      if (reviewError) throw reviewError;

      // 4. camelCase
      const formatted = camelcaseKeys(
        {
          ...review,
          drinkName: review.drinks?.drink_name ?? '',
          shopName: review.shops?.name_en ?? '',
          userName: review.users?.user_name ?? ''
        },
        { deep: true }
      );

      delete formatted.drinks;
      delete formatted.shops;

      return formatted;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'all'],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('review_id', reviewId);

      if (error) throw error;

      return reviewId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'all'] });
    },
  });
};