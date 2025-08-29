import { supabaseAdmin } from '../lib/supabaseAdmin';
import camelcaseKeys from 'camelcase-keys';

export async function fetchReviewsServer() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(`*, drinks!inner(drink_name), shops(name_en), profiles!inner(user_name)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = data.map((r: any) =>
      camelcaseKeys(
        {
          ...r,
          drinkName: r.drinks?.drink_name ?? '',
          shopName: r.shops?.name_en ?? r.shop_name ?? '',
          userName: r.profiles?.user_name ?? ''
        },
        { deep: true }
      )
    );

    formatted.forEach(r => {
      delete r.drinks;
      delete r.shops;
      delete r.profiles;
    });

    return formatted;
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return []; // fallback
  }
}
