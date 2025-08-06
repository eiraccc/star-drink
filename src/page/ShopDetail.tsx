import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopType, ShopTypeWithReview } from "../types/shop";
import { getShopsByQuery } from "../utils/shopService";
import LoadingOverlay from "../component/LoadingOverlay";
import ErrorSection from "../component/ErrorSection";
import DrinkCard from "../component/DrinkCard";
import { useDrinkReview } from "../context/DrinkReviewContext";
import { FaComment, FaStar } from "react-icons/fa";

const ShopDetail = () => {
  const { shopSlug } = useParams<{shopSlug: string}>();
  const [shopData, setShopData] = useState<ShopTypeWithReview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { reviews } = useDrinkReview();

  const fetchShopData = async() => {
    setIsLoading(true);
    try {
      const result = await getShopsByQuery({shopSlug: shopSlug});
      const data = result?.length ? result[0] : null;
      if(!data) return;
      const shopReviews = reviews.filter(n => n.shopId === data.id);
      const totalReviews = shopReviews.length;
      const averageRating = totalReviews > 0
            ? shopReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
            : 0;

      setShopData({
        ...data,
        reviews: shopReviews,
        totalReviews,
        averageRating,
    });
    } catch (error) {
      console.log('get shop error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchShopData();
  }, []);

  const navigate = useNavigate();
  
  return (
    <section className="flex justify-center p-6 pb-10">
      <div className='w-full md:max-w-[800px]'>
        {isLoading ? <LoadingOverlay /> : shopData ? (
          <div>
            <div className="flex justify-between">
              <h2 className="text-text text-lg font-bold flex items-center">
                {shopData.nameEn}
              </h2>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1"/>
                  <span>{shopData.averageRating}/5</span>
                </div>
                <div className="flex items-center">
                  <FaComment className="text-primary mr-1"/>
                  <span>{shopData.totalReviews}</span>
                </div>
              </div>
            </div>
            <hr className="border-t border-secondary my-4" />

            <p className="text-text-secondary mt-2">{shopData.description}</p>

            {shopData.reviews.length ? (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {shopData.reviews.map(review => (
                  <DrinkCard
                    key={review.id}
                    data={review}
                    onClick={() => navigate(`/drink/${review.id}`)}
                  />
                ))}
              </div>
            ) : (
              <ErrorSection
                errorMsg='No drink review yet.'
              />
            )}
            
            
          </div>
        ) : (
          <ErrorSection
            errorMsg='Hmm... no drink shop here. Maybe try a different flavor?'
            btnText="Explore other shops"
            btnAction={() => navigate('/shop/')}
          />
        )}
      </div>
    </section>
  )
}

export default ShopDetail