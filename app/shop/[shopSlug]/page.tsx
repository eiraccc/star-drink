import ShopDetail from './ShopDetail'

type PropsType = {
  params: {
    shopSlug: string
  }
}

export default async function ShopDetailPage({ params }: PropsType) {
  const { shopSlug } = await params;
  return <ShopDetail shopSlug={shopSlug} />
}
