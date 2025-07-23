import { useState } from 'react'
import StarRating from "../component/StarRating"
import { RiArrowDownSLine } from "react-icons/ri";
import { drinkReviewAddForm, SweetnessLevel, IceLevel, Topping } from "../types/drinkReview"

const DrinkAdd = () => {
  const initDrinkReview: drinkReviewAddForm = {
    drinkName: '',
    storeName: '',
    rating: 0,
    sweetness: 'Unset',
    ice: 'Unset',
    toppings: [],
    comment: ''
  }
  const [drinkData, setDrinkData] = useState<drinkReviewAddForm>(initDrinkReview);

  const iceOptions: IceLevel[] =[
    'Unset',
    'No Ice',
    'Less Ice',
    'Light Ice',
    'Regular Ice',
  ];

  const sweetnessOptions: SweetnessLevel[] = [
    'Unset',
    'No Sugar',
    'Less Sugar',
    'Half Sugar',
    'Regular Sugar',
  ];

  return (
    <section className='flex justify-center'>
        <form action="" className='w-full md:max-w-[500px]'>
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
            <div className='relative w-full md:max-w-[400px]'>
              <select
                name="ice" id="ice"
                className="w-full md:max-w-[400px] border-2 border-primary rounded-full pl-3 pr-8 py-1 focus:outline-none focus:border-secondary bg-transparent block appearance-none"
                onChange={(e) => setDrinkData({...drinkData, ice: e.target.value as IceLevel})}
              >
                {
                  iceOptions.map(iceOption => {
                    return <option value={iceOption}>{ iceOption }</option>
                  })
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <RiArrowDownSLine />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="sweetness"
              className="mb-1"
            >Sweetness:</label>
            <div className='relative w-full md:max-w-[400px]'>
              <select
                name="sweetness" id="sweetness"
                className="w-full md:max-w-[400px] border-2 border-primary rounded-full pl-3 pr-8 py-1 focus:outline-none focus:border-secondary bg-transparent block appearance-none"
                onChange={(e) => setDrinkData({...drinkData, sweetness: e.target.value as SweetnessLevel})}
              >
                {
                  sweetnessOptions.map(sweetnessOption => {
                    return <option value={sweetnessOption}>{ sweetnessOption }</option>
                  })
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <RiArrowDownSLine />
              </div>
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

          <div>
            Result:
            {JSON.stringify(drinkData, null, 2)}
          </div>
        </form>
    </section>
  )
}

export default DrinkAdd