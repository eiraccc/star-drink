import { MdStorefront } from "react-icons/md";
import { FaStar, FaComment } from "react-icons/fa"
import { StoreTypeWithReview } from "../types/store";
import StarRating from "./StarRating";

type StoreCardProps = {
  data: StoreTypeWithReview,
  onClick?: () => void
};

const StoreCard = ({ data, onClick }: StoreCardProps) => {
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
            <div className="min-h-[280px]">
                {data.reviews.slice(0,2).map(review => (
                    <div
                        key={review.id}
                        className="bg-surface p-3 rounded-lg mt-2"
                    >
                        <p>{review.drinkName}</p>
                        <StarRating
                            rating={review.rating}
                            readonly={true}
                        />
                        <p className="text-text-secondary text-sm mt-2 min-h-[40px] line-clamp-1">
                            {review.comment}
                        </p>
                    </div>
                ))}
                {data.reviews.length > 2 && <p className="text-right text-primary pr-2">...more</p>}
            </div>
         ) : (
            <div className="min-h-[280px] flex items-center justify-center text-primary">
                No drink yet.
            </div>
         )}
    </div>
  )
}

export default StoreCard