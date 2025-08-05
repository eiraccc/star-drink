import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreType, StoreTypeWithReview } from "../types/store";
import { getStoresByQuery } from "../utils/storesService";
import LoadingOverlay from "../component/LoadingOverlay";
import ErrorSection from "../component/ErrorSection";
import DrinkCard from "../component/DrinkCard";
import { useDrinkReview } from "../context/DrinkReviewContext";
import { FaComment, FaStar } from "react-icons/fa";

const StoreDetail = () => {
  const { storeSlug } = useParams<{storeSlug: string}>();
  const [storeData, setStoreData] = useState<StoreTypeWithReview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { reviews } = useDrinkReview();
  
  console.log(storeSlug)

  const fetchStoreData = async() => {
    setIsLoading(true);
    try {
      const result = await getStoresByQuery({storeSlug: storeSlug});
      const data = result?.length ? result[0] : null;
      if(!data) return;
      const storeReviews = reviews.filter(n => n.storeId === data.id);
      const totalReviews = storeReviews.length;
      const averageRating = totalReviews > 0
            ? storeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
            : 0;

      const currentStore:StoreTypeWithReview =  {
          ...data,
          reviews: storeReviews,
          totalReviews,
          averageRating,
      };
      console.log('currentStore',currentStore)
      setStoreData(currentStore);
    } catch (error) {
      console.log('get store error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStoreData();
  }, []);

  const navigate = useNavigate();
  
  return (
    <section className="flex justify-center p-6 pb-10">
      <div className='w-full md:max-w-[800px]'>
        {isLoading ? <LoadingOverlay /> : storeData ? (
          <div>
            <div className="flex justify-between">
              <h2 className="text-text text-lg font-bold flex items-center">
                {storeData.nameEn}
              </h2>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1"/>
                  <span>{storeData.averageRating}/5</span>
                </div>
                <div className="flex items-center">
                  <FaComment className="text-primary mr-1"/>
                  <span>{storeData.totalReviews}</span>
                </div>
              </div>
            </div>
            <hr className="border-t border-secondary my-4" />

            <p className="text-text-secondary mt-2">{storeData.description}</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {storeData.reviews.map(review => (
                <DrinkCard
                  key={review.id}
                  data={review}
                  onClick={() => navigate(`/drink/${review.id}`)}
                />
              ))}
            </div>
            
          </div>
        ) : (
          <ErrorSection
            errorMsg='Hmm... no drink shop here. Maybe try a different flavor?'
            btnText="Explore other shops"
            btnAction={() => navigate('/store/')}
          />
        )}
      </div>
    </section>
  )
}

export default StoreDetail