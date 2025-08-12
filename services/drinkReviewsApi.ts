import { getReviews } from './drinkReviewsService';
import { DrinkReviewType } from '../src/types/drinkReview';

type ReviewsByShopIdType = {
    [shopId: string]: DrinkReviewType[];
  }

const mapReviewsByShopId = (reviews: DrinkReviewType[]): ReviewsByShopIdType => {
    return reviews.reduce((all, review) => {
        if (!all[review.shopId]) all[review.shopId] = [];
        all[review.shopId].push(review);
        return all;
    }, {} as ReviewsByShopIdType);
};

export const fetchReviews = async () => {
    try {
        const data = (await getReviews({})) ?? [];
        const reviewsByShopId = mapReviewsByShopId(data);
        return { reviews: data, reviewsByShopId };
    } catch (error) {
        console.error('get reviews error', error);
        return { reviews: [], reviewsByShopId: {} };
    }
};