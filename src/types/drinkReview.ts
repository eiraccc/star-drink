export type SugarLevel = 0 | 25 | 50 | 75 | 100;
export type IceLevel = -1 | 0 | 30 | 70 | 100;

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
    sugar: SugarLevel,
    ice: IceLevel,
    toppings: Topping[],
    comment: string,
    userId: string,
    createdAt: string,
}

export type drinkReviewAddForm = Omit<drinkReview, 'id' | 'userId' | 'createdAt'>