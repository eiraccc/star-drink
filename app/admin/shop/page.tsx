import ShopPage from './ShopPage'
import { fetchShops } from '../../../services/shopService'
import { ShopType } from '../../../types/shop';

export default async function AdminShopPage() {
  const allShops = await fetchShops({ mode: 'once', isApproved: true }) as ShopType[];
  return <ShopPage initAllShops={allShops} />
}
