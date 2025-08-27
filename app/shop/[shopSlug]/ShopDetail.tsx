'use client';
import { useMemo } from "react";
import { useRouter } from 'next/navigation';
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorSection from "../../../components/ErrorSection";
import DrinkCard from "../../../components/DrinkCard";
import { FaComment, FaStar } from "react-icons/fa";
import { useReviews } from "../../../services/reviewClient";
import { useShops } from "../../../services/shopClient";

const ShopDetail = ({ shopSlug } : { shopSlug: string }) => {
  const router = useRouter();
  const { data: reviews, isFetching: isLoadingReview } = useReviews({});
  const { data: approvedShops, isFetching: isLoadingApprovedShop } = useShops({ onlyApproved: true });

  const isLoading = isLoadingReview || isLoadingApprovedShop;

  const shopData = useMemo(() => {
    const data = approvedShops.find(n => n.slug === shopSlug);
    if(!data) return null;
    const shopReviews = reviews.filter(n => n.shopId === data.shopId) || [];
    const totalReviews = shopReviews.length;
      const averageRating = totalReviews > 0
            ? shopReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
            : 0;

    return {
        ...data,
        reviews: shopReviews,
        totalReviews,
        averageRating,
    };
  }, [approvedShops, reviews, shopSlug]);
  
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
                    key={review.reviewId}
                    data={review}
                    onClick={() => router.push(`/drink/${review.id}`)}
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
            btnAction={() => router.push('/shop/')}
          />
        )}
      </div>
    </section>
  )
}

export default ShopDetail