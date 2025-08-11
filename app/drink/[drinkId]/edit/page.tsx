import React from 'react'
import DrinkEditor from '../../../../src/page/DrinkEditor'

type PropsType = {
  params: {
    drinkId: string
  }
}

export default async function DrinkEditPage({ params }: PropsType) {
    const { drinkId } = await params;  
    return <DrinkEditor drinkId={drinkId} />
}
