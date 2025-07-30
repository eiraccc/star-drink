import { DrinkReviewType } from "../types/drinkReview";

const STORAGE_KEY = 'drink-reviews';

export const getDrinks = (): DrinkReviewType[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const setDrinks = (items: DrinkReviewType[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};