import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { DrinkRatingType } from "../types/drinkReview";

type propsType = {
  readonly?: boolean,
  rating?: DrinkRatingType,
  onChange: (newRating: DrinkRatingType) => void;
}

const StarRating = ({
  readonly = false,
  rating = 0,
  onChange
}:propsType) => {
  const maxStar:number = 5;
  const [showRating, setShowRating] = useState<DrinkRatingType>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    setShowRating(rating);
  }, [rating]);

  useEffect(() => {
    onChange(showRating)
  }, [showRating])

  return (
    <div className="flex space-x-2">
        {
          Array.from({ length: maxStar }, (_, i) => i + 1).map(index => {
            const ifFilled = (hoverIndex !== null) ? hoverIndex >= index : showRating >= index;
            const StarIcon = ifFilled ? FaStar : FaRegStar;
            return (
              <>
                <StarIcon
                  key={index}
                  size={20}
                  className={`${!readonly && 'cursor-pointer'} text-yellow-500`}
                  onMouseEnter={() => !readonly && setHoverIndex(index)}
                  onMouseLeave={() => !readonly && setHoverIndex(null)}
                  onClick={() => !readonly && setShowRating(index as DrinkRatingType)}
                />
              </>
            )
          })
        }
    </div>
  )
}

export default StarRating