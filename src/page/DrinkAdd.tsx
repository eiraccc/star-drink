import { useState } from 'react'
import StarRating from "../component/StarRating"
import { drinkReviewAddForm, Topping } from "../types/drinkReview"
import { sugarOptions, iceOptions } from '../constants/drink'

const DrinkAdd = () => {
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

  return (
    <section className='flex justify-center'>
        <form action="" className='w-full md:max-w-[400px]'>
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
                        ${isSelected ? "bg-secondary border-secondary" : "bg-background border-primary"}
                      `}
                    />
                    {/* label */}
                    <span className="absolute top-7 w-12 text-[12px] text-center text-secondary whitespace-pre-line leading-tight">
                      { option.label }
                    </span>

                    {/* line */}
                    {index !== sugarOptions.length - 1  && (
                      <div className="absolute top-2 left-5 w-[72px] h-1 bg-primary pointer-events-none" />
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

          <div>
            Result:
            {JSON.stringify(drinkData, null, 2)}
          </div>
        </form>
    </section>
  )
}

export default DrinkAdd