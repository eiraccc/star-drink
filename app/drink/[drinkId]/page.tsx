import DrinkDetail from './DrinkDetail'

type PropsType = {
  params: {
    drinkId: string
  }
}

export default async function DrinkDetailPage({ params }: PropsType) {
    const { drinkId } = await params;
    return <DrinkDetail drinkId={drinkId} />
}
