import { Timestamp, FieldValue } from "firebase/firestore";

export type SugarLevel = 0 | 25 | 50 | 75 | 100;
export type IceLevel = -1 | 0 | 30 | 70 | 100;

export type ToppingType = 
  | 'Pearls' 
  | 'Coconut Jelly' 
  | 'Pudding' 
  | 'Grass Jelly' 
  | string;

export type DrinkRatingType = 0 | 1 | 2 | 3 | 4 | 5;

export interface DrinkReviewType {
    reviewId: string,
    drinkName: string,
    shopName: string,
    shopId: string,
    rating: DrinkRatingType,
    sugar: SugarLevel,
    ice: IceLevel,
    toppings: ToppingType[],
    comment: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
}

export type DrinkReviewFormType = Omit<DrinkReviewType, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export interface DrinkReviewFirestoreData {
  drinkName: string;
  shopName: string;
  shopId: string,
  rating: DrinkRatingType;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: ToppingType[];
  comment: string;
  userId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}