import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import StarRating from '../component/StarRating';
import ErrorSection from '../component/ErrorSection';
import { drinkReviewType } from "../types/drinkReview"
import { iceLabelMap, sugarLabelMap, iceOptions, sugarOptions } from "../constants/drink";
import { MdArrowBackIos } from "react-icons/md";
import { RiDrinks2Fill } from "react-icons/ri";
import { ImCross } from "react-icons/im";


const DrinkDetail = () => {
  const { drinkId } = useParams<{drinkId: string}>();
  const navigate = useNavigate();
  
  const [drinkList, setDrinkList] = useState<drinkReviewType[]>([]);
  const [drinkData, setDrinkData] = useState<drinkReviewType | null>(null);

  useEffect(() => {
    // get data
    const savedData = localStorage.getItem('drink-reviews');
    const savedList:drinkReviewType[] = savedData ? JSON.parse(savedData) : [];
    setDrinkList(savedList);

    const drinkData = savedList.find(n => n.id === Number(drinkId)) || null;
    setDrinkData(drinkData);
  }, []);

  const iceOpacity:number = drinkData ? (iceOptions.find(n => n.value === drinkData.ice)?.opacity || 0) : 0;
  const sugarOpacity:number = drinkData ? (sugarOptions.find(n => n.value === drinkData.sugar)?.opacity || 0) : 0;

  const handleEdit = () => {
    navigate(`/drink/${drinkId}/edit`);
  };

  const handleDelete = () => {
    const newList = drinkList.filter(n => n.id !== Number(drinkId));
    setDrinkList(newList);
    localStorage.setItem('drink-reviews', JSON.stringify(newList));
    navigate('/');
  };

  return (
    <section className='flex justify-center'>
      <div className='w-full md:max-w-[500px]'>
        <Link to="/" className='text-secondary flex items-center mb-4'>
          <MdArrowBackIos />Back home
        </Link>

        {
          drinkData ? (
            <div className='p-4'>
              {/* <RiDrinks2Fill size={30} className="text-primary" /> */}
              <h2 className="text-text text-lg font-bold flex items-center">
                {drinkData.drinkName}
              </h2>
              <p className="text-text-secondary italic">{drinkData.storeName}</p>
              <StarRating readonly={true} rating={drinkData.rating} />
              <div className='mt-1'>
                <label htmlFor="ice" className='mr-2'>Ice:</label>
                <div className={`bg-primary-ice/${iceOpacity} text-text-ice inline-block p-1 text-xs mr-1`}>{iceLabelMap[drinkData.ice]}</div>
              </div>
              <div className='mt-1'>
                <label htmlFor="sugar" className='mr-2'>Sugar:</label>
                <div className={`bg-primary-sugar/${sugarOpacity} text-text-sugar inline-block p-1 text-xs mr-1`}>{sugarLabelMap[drinkData.sugar]}</div>
              </div>
              <div className='mt-1'>
                <label htmlFor="toppings" className='mr-2'>Toppings:</label>
                {drinkData.toppings.length ? drinkData.toppings.map(topping => {
                      return <div key={topping} className={`bg-primary text-background inline-block p-1 text-xs mr-1`}>{topping}</div>
                  }) : <ImCross className='text-primary inline-block' />}
              </div>

              <p className="text-text-secondary text-sm mt-2">{drinkData.comment}</p>
              <hr className="border-t border-secondary my-4" />
              <p className="text-text-secondary text-xs mt-2">
                Post by <span className='text-primary'>{drinkData.userId}</span> on {drinkData.createdAt}
              </p>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-primary text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-danger text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                >
                  Delete
                </button>
              </div>
              
            </div>
          ) : (
            <ErrorSection
              errorMsg='Uh-oh, no drinks here yet!'
              btnActionHome={true}
            />
          )
        }
      </div>
    </section>
  )
}

export default DrinkDetail