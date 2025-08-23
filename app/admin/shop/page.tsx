import ShopPage from './ShopPage'
import { fetchShopsServer } from '../../../services/shopServer';
import { ShopType } from '../../../types/shop';

export default async function AdminShopPage() {
  const allShops = await fetchShopsServer() as ShopType[];
  console.log('allShops', allShops)
  return <ShopPage initAllShops={allShops} />
}
