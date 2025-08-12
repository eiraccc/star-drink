import ShopDetail from './ShopDetail'

type PropsType = {
  params: Promise<{ shopSlug: string }>;
}

export default async function ShopDetailPage({ params }: PropsType) {
  const { shopSlug } = await params;
  return <ShopDetail shopSlug={shopSlug} />
}
