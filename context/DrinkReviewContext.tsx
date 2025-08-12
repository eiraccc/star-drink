'use client'
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { DrinkReviewType, DrinkReviewFormType } from '../types/drinkReview';
import {
  getReviews as getReviewsFromFB,
  addReview as addReviewToFB,
  updateReview as updateReviewInFB,
  deleteReview as deleteReviewInFB,
} from '../services/drinkReviewsService';

type ReviewsByShopIdType = {
  [shopId: string]: DrinkReviewType[];
}

type State = {
  reviews: DrinkReviewType[];
  reviewsByShopId: ReviewsByShopIdType;
  isLoadingReview: boolean;
};

type Action =
  | { type: 'LOAD'; payload: {
    reviews: DrinkReviewType[],
    reviewsByShopId: ReviewsByShopIdType
  } }
  | { type: 'SET_LOADING'; payload: boolean };

// reducer: updates state based on the given action
const drinkReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        reviews: action.payload.reviews, 
        reviewsByShopId: action.payload.reviewsByShopId,
      };
    case 'SET_LOADING':
      return { ...state, isLoadingReview: action.payload };
    default:
      return state;
  }
};

export const DrinkReviewProvider = ({ children, initData }: {
  children: ReactNode,
  initData: Omit<State, 'isLoadingReview'>
}) => {
  const [state, dispatch] = useReducer(drinkReducer, {
    ...initData,
    isLoadingReview: false,
  });

  const mapReviewsByShopId = (reviews: DrinkReviewType[]): ReviewsByShopIdType => {
    return reviews.reduce((all, review) => {
      if (!all[review.shopId]) all[review.shopId] = [];
      all[review.shopId].push(review);
      return all;
    }, {} as ReviewsByShopIdType);
  };

  const fetchReviews = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getReviewsFromFB({});
      const reviewsByShopId = mapReviewsByShopId(data);
      dispatch({ type: 'LOAD', payload: { reviews: data, reviewsByShopId } });
    } catch (error) {
      console.error('get reviews error', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addReview = async (data: DrinkReviewFormType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await addReviewToFB({ ...data, userId: 'testUser' });
      await fetchReviews(); // fetch new data
    } catch (error) {
      console.error('add review error', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const editReview = async (id: string, data: DrinkReviewFormType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await updateReviewInFB(id, data);
      await fetchReviews();
    } catch (error) {
      console.error('edit review error', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteReview = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await deleteReviewInFB(id);
      await fetchReviews();
    } catch (error) {
      console.error('delete review error', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // useEffect(() => {
  //   fetchReviews();
  // }, []);

  return (
    <DrinkReviewContext.Provider
      value={{
        reviews: state.reviews,
        reviewsByShopId: state.reviewsByShopId,
        isLoadingReview: state.isLoadingReview,
        fetchReviews,
        addReview,
        editReview,
        deleteReview,
      }}>
      {children}
    </DrinkReviewContext.Provider>
  );
};

// context
type DrinkReviewContextType = {
  reviews: DrinkReviewType[];
  reviewsByShopId: ReviewsByShopIdType;
  isLoadingReview: boolean;
  fetchReviews: () => Promise<void>;
  addReview: (data: DrinkReviewFormType) => Promise<void>;
  editReview: (id: string, data: DrinkReviewFormType) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
};

const DrinkReviewContext = createContext<DrinkReviewContextType | undefined>(
  undefined
);

export const useDrinkReview = () => {
  const context = useContext(DrinkReviewContext);
  if (!context) throw new Error('Must use within <DrinkReviewProvider>');
  return context;
};
