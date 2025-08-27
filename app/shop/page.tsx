import ShopList from './ShopList'
import { fetchShopsServer } from '../../services/shopServer'

export default async function ShopListPage() {
  const approvedShops = await fetchShopsServer();
  return <ShopList initShopData={approvedShops} />
}
