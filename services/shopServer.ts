import { supabaseAdmin } from '../lib/supabaseAdmin';
import camelcaseKeys from 'camelcase-keys';

export async function fetchShopsServer() {
  try {
    const { data, error } = await supabaseAdmin
      .from('shops')
      .select(`*, profiles!inner(email)`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const formatted = data.map((shop: any) =>
      camelcaseKeys(
        {
          ...shop,
          submittedByEmail: shop?.profiles?.email ?? ''
        },
        { deep: true }
      )
    );
  
    formatted.forEach(shop => {
      delete shop.profiles;
    });
    
    return formatted;
  } catch (err) {
    console.error('Failed to fetch shops:', err);
    return [];
  }
}