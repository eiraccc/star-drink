import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { drinkReviewType, drinkReviewAddForm } from '../types/drinkReview';
import { formatInTimeZone } from 'date-fns-tz';
import { getDrinks, setDrinks } from '../utils/localStorageService';
import { mockDrinkReviews } from '../data/mockDrinkReviews';

type State = {
  reviews: drinkReviewType[];
  isLoading: boolean;
};

type Action =
  | { type: 'LOAD'; payload: drinkReviewType[] }
  | { type: 'LOAD_DEMO'; payload: drinkReviewType[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD'; payload: drinkReviewType }
  | { type: 'EDIT'; payload: drinkReviewType }
  | { type: 'DELETE'; payload: number };

// reducer: updates state based on the given action
const drinkReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD':
      return { ...state, reviews: action.payload };
    case 'LOAD_DEMO':
      return { ...state, reviews: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD': {
      return { ...state, reviews: [...state.reviews, action.payload] };
    }
    case 'EDIT': {
      const newList = state.reviews.map(n => {
        return n.id === action.payload.id ? action.payload : n;
      });
      return { ...state, reviews: newList };
    }
    case 'DELETE': {
      const newList = state.reviews.filter(
        n => n.id !== Number(action.payload)
      );
      return { ...state, reviews: newList };
    }
    default:
      return state;
  }
};

export const DrinkReviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(drinkReducer, {
    reviews: [],
    isLoading: false,
  });

  const fetchReviews = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(res => setTimeout(res, 1500));
    const data = getDrinks();
    dispatch({ type: 'LOAD', payload: data });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const loadDemoReviews = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(res => setTimeout(res, 1500));
    setDrinks(mockDrinkReviews);
    dispatch({ type: 'LOAD_DEMO', payload: mockDrinkReviews });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const addReview = async (data: drinkReviewAddForm) => {
    const finalId = Math.max(...state.reviews.map(n => n.id));
    const nowTimeUTC = formatInTimeZone(
      new Date(),
      'UTC',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    const newReview: drinkReviewType = {
      ...data,
      id: finalId + 1,
      userId: 'testUser',
      createdAt: nowTimeUTC,
      updatedAt: nowTimeUTC,
    };

    // api
    const newList = [...state.reviews, newReview];
    setDrinks(newList);
    dispatch({ type: 'ADD', payload: newReview });
  };

  const editReview = async (id: number, data: drinkReviewAddForm) => {
    const nowTimeUTC = formatInTimeZone(
      new Date(),
      'UTC',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    const newList = state.reviews.map(item => {
      if (item.id === Number(id))
        return {
          ...item,
          ...data,
          updatedAt: nowTimeUTC,
        };
      return item;
    });
    const editReview = newList.find(n => n.id === id);
    if (!editReview) return;

    // api
    setDrinks(newList);
    dispatch({ type: 'EDIT', payload: editReview });
  };

  const deleteReview = async (id: number) => {
    const newList = state.reviews.filter(n => n.id !== Number(id));

    // api
    setDrinks(newList);
    dispatch({ type: 'DELETE', payload: id });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <DrinkReviewContext.Provider
      value={{
        reviews: state.reviews,
        isLoading: state.isLoading,
        fetchReviews,
        loadDemoReviews,
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
  reviews: drinkReviewType[];
  isLoading: boolean;
  fetchReviews: () => Promise<void>;
  loadDemoReviews: () => Promise<void>;
  addReview: (data: drinkReviewAddForm) => Promise<void>;
  editReview: (id: number, data: drinkReviewAddForm) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
};

const DrinkReviewContext = createContext<DrinkReviewContextType | undefined>(
  undefined
);

export const useDrinkReview = () => {
  const context = useContext(DrinkReviewContext);
  if (!context) throw new Error('Must use within <DrinkReviewProvider>');
  return context;
};
