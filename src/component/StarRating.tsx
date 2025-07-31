import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { DrinkRatingType } from "../types/drinkReview";

type propsType = {
  readonly?: boolean,
  rating?: DrinkRatingType,
  onChange?: (newRating: DrinkRatingType) => void;
}

const StarRating = ({
  readonly = false,
  rating = 0,
  onChange
}:propsType) => {
  const maxStar:number = 5;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if(!readonly && onChange) onChange(index as DrinkRatingType);
  }

  const currentRating = rating ?? 0;

  return (
    <div className="flex space-x-2 py-1">
        {
          Array.from({ length: maxStar }, (_, i) => i + 1).map(index => {
            const ifFilled = (hoverIndex !== null) ? hoverIndex >= index : currentRating >= index;
            const StarIcon = ifFilled ? FaStar : FaRegStar;
            return (
              <StarIcon
                key={index}
                size={30}
                className={`${!readonly ? 'cursor-pointer' : ''} text-yellow-500`}
                onMouseEnter={() => !readonly && setHoverIndex(index)}
                onMouseLeave={() => !readonly && setHoverIndex(null)}
                onClick={() => handleClick(index)}
              />
            )
          })
        }
    </div>
  )
}

export default StarRating