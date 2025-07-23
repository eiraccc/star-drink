import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

type propsType = {
  readonly?: boolean,
  rating?: number
}

const StarRating = ({
  readonly = false,
  rating = 0
}:propsType) => {
  const maxStar:number = 5;
  const [showRating, setShowRating] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    setShowRating(rating);
  }, [rating]);

  return (
    <div className="flex space-x-1">
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
                  onClick={() => !readonly && setShowRating(index)}
                />
              </>
            )
          })
        }
    </div>
  )
}

export default StarRating