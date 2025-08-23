import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import camelcaseKeys from 'camelcase-keys';

// GET /api/reviews
export async function GET() {
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

    const formatted = data.map((r: any) => camelcaseKeys({
      ...r,
      drink_name: r.drinks.drink_name,
      shop_name: r.shops.name_en
    }, { deep: true }));

    formatted.forEach(r => {
      delete r.drinks;
      delete r.shops;
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
