'use client';
import { ShopTypeWithReview } from "../types/shop";
import StarRating from "./StarRating";
import { MdStorefront } from "react-icons/md";
import { FaStar, FaComment } from "react-icons/fa"
import { RiDrinks2Fill } from "react-icons/ri";

type ShopCardProps = {
  data: ShopTypeWithReview,
  onClick?: () => void
};

const ShopCard = ({ data, onClick }: ShopCardProps) => {
  return (
    <div
        onClick={onClick}
        className="bg-surface-light p-3 relative overflow-hidden shadow-lg rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
    >
        <div className="absolute top-0 right-0 w-16 h-16 bg-background rounded-bl-full" />
        <div className="absolute top-3 right-3 rounded-full">
            <MdStorefront size={30} className="text-surface" />
        </div>

        <p className="text-text text-lg font-bold ">{data.nameEn}</p>
        <div className="flex items-center">
           <FaComment className="text-primary mr-1"/>
           <span>Total Reviews: {data.totalReviews}</span>
        </div>
        <div className="flex items-center">
           <FaStar className="text-yellow-100 mr-1"/>
           <span>Avg. Rating: {data.averageRating}/5</span>
        </div>
        {data.reviews.length ? (
           <div className="min-h-[250px]">
               {data.reviews.slice(0,2).map(review => (
                   <div
                       key={review.shopId}
                       className="bg-background p-3 rounded-lg mt-2"
                   >
                        <div className="flex gap-2 items-center">
                            <RiDrinks2Fill />
                            {review.drinkName}
                        </div>
                        <StarRating
                            rating={review.rating}
                            readonly={true}
                        />
                        <p className="text-text-secondary text-sm mt-2 min-h-[20px] line-clamp-1">
                            {review.comment}
                        </p>
                   </div>
               ))}
               {data.reviews.length > 2 && <p className="text-right text-primary pr-2">...more</p>}
           </div>
        ) : (
           <div className="min-h-[250px] flex items-center justify-center text-primary">
               No drink yet.
           </div>
        )}
    </div>
  )
}

export default ShopCard