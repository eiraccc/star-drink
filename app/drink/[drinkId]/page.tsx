import React from 'react'
import DrinkDetail from '../../../src/page/DrinkDetail'

type PropsType = {
  params: {
    drinkId: string
  }
}

export default async function DrinkDetailPage({ params }: PropsType) {
    const { drinkId } = await params;  
    return <DrinkDetail drinkId={drinkId} />
}
