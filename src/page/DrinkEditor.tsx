import React, { useState, useEffect, useCallback } from 'react'
import StarRating from "../component/StarRating"
import { drinkReviewAddForm, drinkReviewType, IceLevel, SugarLevel } from "../types/drinkReview"
import { sugarOptions, iceOptions, toppingOptions, ToppingLabelType } from '../constants/drink'
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate, useParams } from 'react-router-dom';
import MultiSelect from '../component/MultiSelect';
import StepSelector from '../component/StepSelector';

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
  const [showToppingOptions, setShowToppingOptions] = useState<ToppingLabelType[]>(toppingOptions);
  const [toppingSelected, setToppingSelected] = useState<ToppingLabelType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('drink-reviews');
    const list: drinkReviewType[] = savedData ? JSON.parse(savedData) : [];
    setDrinkList(list);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const currentDrink = drinkList.find(n => n.id === Number(drinkId));
      if(currentDrink) {
        setDrinkData(currentDrink);
        
        currentDrink.toppings.forEach(topping => {
          addNewTopping(topping);
        });
      };
      
    }
  }, [drinkId, drinkList]);

  useEffect(() => {
    setDrinkData({...drinkData, toppings: toppingSelected.map(n => n.value)})
  }, [toppingSelected])

  const addNewTopping = useCallback((newTopping:string)  => {
    const newToppingValue = newTopping.trim().toLowerCase().replace(/\s+/g, '-');
    const newOption:ToppingLabelType = {
      value: newToppingValue,
      label: newTopping.replace(' ', '\n'),
      type: 'topping'
    };

    const alreadyExist = showToppingOptions.some(n => n.value === newToppingValue);
    if(!alreadyExist) setShowToppingOptions(prev => [...prev, newOption]);

    const alreadySelected = toppingSelected.some(n => n.value === newToppingValue);
    if(!alreadySelected) setToppingSelected(prev => [...prev, newOption]);
  }, [toppingSelected, setToppingSelected, setShowToppingOptions])

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
        <div className='w-full md:max-w-[500px]'>
          <div className="mb-2">
            <label
              htmlFor="drinkName"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Drink Name:</label>
            <input
              type="text"
              id="drinkName"
              className='w-full md:max-w-[500px] border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
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
              className='w-full md:max-w-[500px] border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
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
            <StepSelector
              options={iceOptions}
              selectedValue={drinkData.ice}
              onChange={(val) => setDrinkData({ ...drinkData, ice: val as IceLevel })}
              activeColorClass="bg-secondary-ice border-secondary-ice"
              baseColorClass="bg-background border-primary-ice"
              lineColorClass="bg-primary-ice"
              labelColorClass="text-text-ice"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="sugar"
              className="mb-1"
            >Sugar:</label>
            <StepSelector
              options={sugarOptions}
              selectedValue={drinkData.sugar}
              onChange={(val) => setDrinkData({ ...drinkData, sugar: val as SugarLevel })}
              activeColorClass="bg-secondary-sugar border-secondary-sugar"
              baseColorClass="bg-background border-primary-sugar"
              lineColorClass="bg-primary-sugar"
              labelColorClass="text-text-sugar"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="toppings" className='mb-1 block'>Toppings:</label>
            <MultiSelect<ToppingLabelType>
              options={showToppingOptions}
              selected={toppingSelected}
              setSelected={setToppingSelected}
              placeholder='Select toppings'
              maxToShow={10}
              borderColor='primary'
              creatable={true}
              onCreateOption={(inputValue) => addNewTopping(inputValue)}
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="comment"
              className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
            >Comment:</label>
            <textarea
              id="comment"
              className='w-full md:max-w-[500px] border-2 border-primary rounded-xl py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
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