import { useState, useEffect } from "react"
import { mockDrinkReviews } from "../data/mockDrinkReviews"
import { drinkReviewType } from "../types/drinkReview";
import DrinkCard from "../component/DrinkCard";
import { useNavigate } from 'react-router-dom';

const DrinkList = () => {
  const [reviews, setReviews] = useState<drinkReviewType[]>([]);

  const navigate = useNavigate();
  const goToDrinkDetail = (id: number) => {
    navigate(`/drink/${id}`);
  };

  useEffect(() => {
    const dataFromStorage = localStorage.getItem('drink-reviews');
    if(dataFromStorage) {
      setReviews(JSON.parse(dataFromStorage));
    } else {
      localStorage.setItem('drink-reviews', JSON.stringify(mockDrinkReviews));
      setReviews(mockDrinkReviews);
    }
  }, []);

  return (
    <section>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <DrinkCard key={review.id} data={review} onClick={() => goToDrinkDetail(review.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DrinkList