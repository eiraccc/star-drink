import { useState, useEffect, useMemo } from "react"
import { useNavigate } from 'react-router-dom';

import { mockDrinkReviews } from "../data/mockDrinkReviews"
import { drinkReviewType } from "../types/drinkReview";
import { sugarOptions, iceOptions, SugarIceLabelType, toppingOptions, ToppingLabelType } from '../constants/drink'
import DrinkCard from "../component/DrinkCard";
import MultiSelect from "../component/MultiSelect";
import ErrorSection from "../component/ErrorSection";

import { RxCaretSort } from "react-icons/rx";
import { RiArrowDownSLine, RiArrowUpSLine, RiSearchLine, RiTimeLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";

const DrinkList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<drinkReviewType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedIce, setSelectedIce] = useState<SugarIceLabelType[]>(iceOptions);
  const [selectedSugar, setSelectedSugar] = useState<SugarIceLabelType[]>(sugarOptions);
  const [selectedTopping, setSelectedTopping] = useState<ToppingLabelType[]>([])
  
  type SortKey = 'rating' | 'postTime';;
  type SortOrder = 'desc' | 'asc';
  type SortType = {
    key: SortKey,
    order: SortOrder
  };
  const [sort, setSort] = useState<SortType>({
    key: 'rating',
    order: 'desc'
  });

  const toggleSort = (key:SortKey) => {
    setSort(preSort => {
      if(key === preSort.key) {
        return {key, order: preSort.order === 'desc' ? 'asc' : 'desc'}
      } else {
        return {key, order: 'desc'}
      }
    })
  };

  const navigate = useNavigate();
  const goToDrinkDetail = (id: number) => {
    navigate(`/drink/${id}`);
  };

  // init data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const dataFromStorage = localStorage.getItem('drink-reviews');
      if(dataFromStorage) setReviews(JSON.parse(dataFromStorage));
      setIsLoading(false);
    }, 2000);
  }, []);

  const loadDemoData = () => {
    localStorage.setItem('drink-reviews', JSON.stringify(mockDrinkReviews));
    setReviews(mockDrinkReviews);
  }

  const sortReviews = useMemo(() => {
    return [...reviews].filter(review => {
      const ifSearchMatch = review.drinkName.toLowerCase().includes(searchValue.toLowerCase());
      const iceFilter = selectedIce.map(n => n.value).includes(review.ice);
      const sugarFilter = selectedSugar.map(n => n.value).includes(review.sugar);
      const toppingFilter = selectedTopping.length ? selectedTopping.some(n => review.toppings.includes(n.value)) : true;
      return ifSearchMatch && iceFilter && sugarFilter && toppingFilter;
    }).sort((a, b) => {
      if(sort.key === 'rating') {
        return sort.order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      } else {
        return sort.order === 'desc'
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt);
      }
    })
  }, [reviews, sort, searchValue, selectedIce, selectedSugar, selectedTopping]);

  return (
    <section>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 p-3 mb-3">
          {/* input */}
          <div className="flex items-center gap-2 border-2 border-surface focus-within:border-primary rounded-full px-4 py-2 w-full">
            <RiSearchLine className="text-text font-bold" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search drinks..."
              className="flex-1 bg-transparent text-sm text-primary placeholder-surface outline-none"
            />
          </div>
          {/* filter */}
          <div className="flex flex-col sm:flex-row items-start">
            <div className="w-full sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] sm:mr-2 mb-2 sm:mb-0">
              <MultiSelect<SugarIceLabelType>
                options={iceOptions}
                selected={selectedIce}
                setSelected={setSelectedIce}
                placeholder="Ice levels"
              />
            </div>
            <div className="w-full sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] sm:mr-2 mb-2 sm:mb-0">
              <MultiSelect<SugarIceLabelType>
                options={sugarOptions}
                selected={selectedSugar}
                setSelected={setSelectedSugar}
                placeholder="Sugar levels"
              />
            </div>
            <div className="w-full sm:w-64 md:w-80 lg:w-96 xl:w-[28rem]">
              <MultiSelect<ToppingLabelType>
                options={toppingOptions}
                selected={selectedTopping}
                setSelected={setSelectedTopping}
                placeholder="Toppings (any)"
              />
            </div>
            {/* <p
              onClick={() => {
                setSelectedIce([]);
                setSelectedSugar([]);
              }}
              className="underline cursor-pointer ml-0 sm:ml-2 mt-2 sm:mt-0"
            >Clear Filters</p> */}
          </div>
          {/* sort */}
          <div className="flex pl-2">
            <button
              onClick={() => toggleSort('rating')}
              className={`mr-3 flex items-center justify-center ${sort.key === 'rating' && 'font-bold'}`}
            >
              <FaRegStar className="mr-1" />Rating
              {
                sort.key !== 'rating' ? <RxCaretSort /> :
                  sort.order === 'desc' ? <RiArrowUpSLine /> : <RiArrowDownSLine />
              } 
            </button>
            <button
              onClick={() => toggleSort('postTime')}
              className={`flex items-center justify-center ${sort.key === 'postTime' && 'font-bold'}`}
            >
              <RiTimeLine className="mr-1" />Post Time
              {
                sort.key !== 'postTime' ? <RxCaretSort /> :
                  sort.order === 'desc' ? <RiArrowUpSLine /> : <RiArrowDownSLine />
              } 
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        )}
        
        {sortReviews.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortReviews.map((review) => (
              <DrinkCard
                key={review.id}
                data={review}
                onClick={() => goToDrinkDetail(review.id)}
              />
            ))}
          </div>
        )}

        {!sortReviews.length && !isLoading &&  (
          reviews.length > 0 ? (
            <ErrorSection
              errorMsg='Hmm… no drinks found. Maybe try different filters.'
            />
          ) : (
            <ErrorSection
              errorMsg={`Oops! No drinks here yet. Let's add some delicious ones!`}
              btnText='Load Demo Data'
              btnAction={loadDemoData}
            />
          )
        )}
      </div>
    </section>
  )
}

export default DrinkList