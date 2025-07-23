export type SweetnessLevel =
    | 'No Sugar'
    | 'Less Sugar'
    | 'Half Sugar'
    | 'Regular Sugar'
    | 'Unset'

export type IceLevel = 
    | 'No Ice'
    | 'Less Ice'
    | 'Light Ice'
    | 'Regular Ice'
    | 'Unset'

export type Topping = 
  | 'Pearls' 
  | 'Coconut Jelly' 
  | 'Pudding' 
  | 'Grass Jelly' 
  | string;

export type DrinkRatingType = 0 | 1 | 2 | 3 | 4 | 5;

export interface drinkReview {
    id: number,
    drinkName: string,
    storeName: string,
    rating: DrinkRatingType,
    sweetness: SweetnessLevel,
    ice: IceLevel,
    toppings: Topping[],
    comment: string,
    userId: string,
    createdAt: string,
}

export type drinkReviewAddForm = Omit<drinkReview, 'id' | 'userId' | 'createdAt'>