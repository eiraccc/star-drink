import StarRating from "./StarRating"
import { drinkReviewType } from "../types/drinkReview"
import { iceLabelMap, sugarLabelMap, iceOptions, sugarOptions } from "../constants/drink";
import { RiDrinks2Fill } from "react-icons/ri";

type DrinkCardProps = {
  data: drinkReviewType;
};


const DrinkCard = ({ data }: DrinkCardProps) => {
    const iceOpacity = iceOptions.find(n => n.value === data.ice)?.opacity;
    const sugarOpacity = sugarOptions.find(n => n.value === data.sugar)?.opacity;

    return (
        <div className="bg-surface p-3 relative overflow-hidden shadow-lg rounded-lg">
            <div className="absolute top-0 right-0 w-16 h-16 bg-background rounded-bl-full" />
            <div className="absolute top-3 right-3 rounded-full">
                <RiDrinks2Fill size={30} className="text-surface" />
            </div>

            <p className="text-text text-lg font-bold ">{data.drinkName}</p>
            <p className="text-text-secondary italic">{data.storeName}</p>
            <StarRating readonly={true} rating={data.rating} />
            <div className="mt-2">
                <div className={`bg-primary-ice/${iceOpacity} text-background inline-block p-1 text-xs mr-1`}>{iceLabelMap[data.ice]}</div>
                <div className={`bg-primary-sugar/${sugarOpacity} text-background inline-block p-1 text-xs`}>{sugarLabelMap[data.sugar]}</div>
            </div>
            <div className="min-h-[24px] mt-1">
                {data.toppings.map(topping => {
                    return <div key={topping} className={`bg-primary text-background inline-block p-1 text-xs mr-1`}>{topping}</div>
                })}
            </div>
            <p className="text-text-secondary text-sm mt-2 min-h-[40px] line-clamp-2">{data.comment}</p>
            <p className="text-background text-xs text-right mt-2">{data.createdAt}</p>
        </div>
    )
}

export default DrinkCard