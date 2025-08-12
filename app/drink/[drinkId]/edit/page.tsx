import DrinkEditor from '../../../../components/DrinkEditor'

type pageProps = {
  params: Promise<{ drinkId: string }>;
}

export default async function DrinkEditPage({ params }: pageProps) {
    const { drinkId } = await params;  
    return <DrinkEditor drinkId={drinkId} />
}
