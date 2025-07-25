import React, { useState, useEffect } from 'react'
import StarRating from "../component/StarRating"
import { drinkReviewAddForm, Topping, drinkReviewType } from "../types/drinkReview"
import { sugarOptions, iceOptions } from '../constants/drink'
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate, useParams } from 'react-router-dom';

const DrinkAdd = () => {
  const { drinkId } = useParams<{ drinkId: string }>();
  const isEdit = Boolean(drinkId);

  const initDrinkReview: drinkReviewAddForm = {
    drinkName: '',
    storeName: '',
    rating: 0,
    sugar: 100,
    ice: 100,
    toppings: [],
    comment: ''
  }
  const [drinkData, setDrinkData] = useState<drinkReviewAddForm>(initDrinkReview);
  const [drinkList, setDrinkList] = useState<drinkReviewType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('drink-reviews');
    const list: drinkReviewType[] = savedData ? JSON.parse(savedData) : [];
    setDrinkList(list);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const currentDrink = drinkList.find(n => n.id === Number(drinkId));
      currentDrink && setDrinkData(currentDrink);
    }
  }, [drinkId, drinkList]);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const finalId = Math.max(...drinkList.map(n => n.id));
    const nowTimeUTC = formatInTimeZone(new Date(), 'UTC', "yyyy-MM-dd'T'HH:mm:ssXXX");
    
    const newReview = {
      ...drinkData,
      id: finalId + 1,
      userId: 'testUser',
      createdAt: nowTimeUTC
    }
    console.log('new', newReview);

    const newList = [...drinkList, newReview];
    setDrinkList(newList);
    localStorage.setItem('drink-reviews', JSON.stringify(newList));

    navigate('/');
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newList = drinkList.map(item => {
      if(item.id === Number(drinkId)) return {...item, ...drinkData};
      return item;
    });

    setDrinkList(newList);
    localStorage.setItem('drink-reviews', JSON.stringify(newList));

    navigate(`/drink/${drinkId}`);
  };

  const handleCancel = () => {
    navigate(isEdit ? `/drink/${drinkId}` : '/');
  };

  return (
    <section className='flex justify-center'>
        <div className='w-full md:max-w-[400px]'>
          <div className="mb-2">
            <label
              htmlFor="drinkName"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Drink Name:</label>
            <input
              type="text"
              id="drinkName"
              className='w-full md:max-w-[400px] border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
              value={ drinkData.drinkName }
              onChange={(e) => setDrinkData({...drinkData, drinkName: e.target.value})}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="storeName"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Store Name:</label>
            <input
              type="text"
              id="storeName"
              className='w-full md:max-w-[400px] border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
              value={drinkData.storeName}
              onChange={(e) => setDrinkData({...drinkData, storeName: e.target.value})}
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="rating"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Rating:</label>
              <StarRating
                rating={ drinkData.rating }
                onChange={(newRating) => setDrinkData({...drinkData, rating: newRating})}
              />
          </div>
          <div className="mb-2">
            <label
              htmlFor="ice"
              className="mb-1"
            >Ice:</label>
            <div className="relative flex items-center justify-between mt-2 px-2 pb-10">
              {iceOptions.map((option, index) => {
                const isSelected = drinkData.ice === option.value;
                return (
                  <div
                    key={option.value}
                    className="relative z-10 flex flex-col items-center cursor-pointer"
                    onClick={() => setDrinkData({...drinkData, ice: option.value})}
                  >
                    {/* dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-colors 
                        ${isSelected ? "bg-secondary-ice border-secondary-ice" : "bg-background border-primary-ice"}
                      `}
                    />
                    {/* label */}
                    <span className="absolute top-7 w-12 text-[12px] text-center text-text-ice whitespace-pre-line leading-tight">
                      { option.label }
                    </span>

                    {/* line */}
                    {index !== iceOptions.length - 1  && (
                      <div className="absolute top-2 left-5 w-[72px] h-1 bg-primary-ice pointer-events-none" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="sugar"
              className="mb-1"
            >Sugar:</label>
            <div className="relative flex items-center justify-between mt-2 px-2 pb-10">
              {sugarOptions.map((option, index) => {
                const isSelected = drinkData.sugar === option.value;
                return (
                  <div
                    key={option.value}
                    className="relative z-10 flex flex-col items-center cursor-pointer"
                    onClick={() => setDrinkData({...drinkData, sugar: option.value})}
                  >
                    {/* dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-colors 
                        ${isSelected ? "bg-secondary-sugar border-secondary-sugar" : "bg-background border-primary-sugar"}
                      `}
                    />
                    {/* label */}
                    <span className="absolute top-7 w-12 text-[12px] text-center text-secondary whitespace-pre-line leading-tight">
                      { option.label }
                    </span>

                    {/* line */}
                    {index !== sugarOptions.length - 1  && (
                      <div className="absolute top-2 left-5 w-[72px] h-1 bg-primary-sugar pointer-events-none" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-2">
            <label
              htmlFor="comment"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Comment:</label>
            <textarea
              id="comment"
              className='w-full md:max-w-[400px] border-2 border-primary rounded-xl py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
              value={drinkData.comment}
              onChange={(e) => setDrinkData({...drinkData, comment: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="w-1/2 px-4 py-2 border rounded-lg text-sm text-text-secondary border-text-secondary hover:bg-surface"
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
            <button
              className="w-1/2 px-4 py-2 rounded-lg text-sm text-white bg-primary hover:opacity-80 disabled:opacity-50"
              onClick={(e) => isEdit ? handleEdit(e) : handleAdd(e)}
            >
              {isEdit ? 'Edit' : 'Add'}
            </button>
          </div>
        </div>
    </section>
  )
}

export default DrinkAdd