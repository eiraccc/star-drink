import { supabaseAdmin } from '../lib/supabaseAdmin';
import camelcaseKeys from 'camelcase-keys';

export async function fetchReviewsServer() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        review_id,
        rating,
        sugar,
        ice,
        toppings,
        comment,
        user_id,
        drink_id,
        shop_id,
        created_at,
        updated_at,
        drinks!inner(drink_name),
        shops!inner(name_en)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = data.map((r: any) =>
      camelcaseKeys(
        {
          ...r,
          drink_name: r.drinks.drink_name,
          shop_name: r.shops.name_en,
        },
        { deep: true }
      )
    );

    formatted.forEach(r => {
      delete r.drinks;
      delete r.shops;
    });

    return formatted;
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return []; // fallback
  }
}
