import { supabaseAdmin } from '../lib/supabaseAdmin';
import camelcaseKeys from 'camelcase-keys';

export async function fetchShopsServer() {
  try {
    const { data, error } = await supabaseAdmin
      .from('shops')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map((r: any) => camelcaseKeys(r, { deep: true }));
  } catch (err) {
    console.error('Failed to fetch shops:', err);
    return [];
  }
}