import { useState, useEffect, useMemo } from "react"
import { mockDrinkReviews } from "../data/mockDrinkReviews"
import { drinkReviewType } from "../types/drinkReview";
import DrinkCard from "../component/DrinkCard";
import { useNavigate } from 'react-router-dom';
import { RxCaretSort } from "react-icons/rx";
import { RiArrowDownSLine, RiArrowUpSLine, RiSearchLine, RiTimeLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";

const DrinkList = () => {
  const [reviews, setReviews] = useState<drinkReviewType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  type SortKey = 'rating' | 'postTime';;
  type SortOrder = 'desc' | 'asc';
  type SortType = {
    key: SortKey,
    order: SortOrder
  };
  const [sort, setSort] = useState<SortType>({
    key: 'rating',
    order: 'desc'
  })

  const toggleSort = (key:SortKey) => {
    setSort(preSort => {
      if(key === preSort.key) {
        return {key, order: preSort.order === 'desc' ? 'asc' : 'desc'}
      } else {
        return {key, order: 'desc'}
      }
    })
  }

  const navigate = useNavigate();
  const goToDrinkDetail = (id: number) => {
    navigate(`/drink/${id}`);
  };

  useEffect(() => {
    const dataFromStorage = localStorage.getItem('drink-reviews');
    if(dataFromStorage) {
      setReviews(JSON.parse(dataFromStorage));
    } else {
      localStorage.setItem('drink-reviews', JSON.stringify(mockDrinkReviews));
      setReviews(mockDrinkReviews);
    }
  }, []);

  const sortReviews = useMemo(() => {
    return [...reviews].filter(n => {
      return n.drinkName.toLowerCase().includes(searchValue.toLowerCase());
    }).sort((a, b) => {
      if(sort.key === 'rating') {
        return sort.order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      } else {
        return sort.order === 'desc'
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt);
      }
    })
  }, [reviews, sort, searchValue]);

  return (
    <section>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 p-3 mb-3">
          {/* input */}
          <div className="flex items-center gap-2 border-2 border-surface rounded-full px-4 py-2 w-full">
            <RiSearchLine className="text-text font-bold" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search drinks..."
              className="flex-1 bg-transparent text-sm text-primary placeholder-surface outline-none"
            />
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortReviews.map((review) => (
            <DrinkCard key={review.id} data={review} onClick={() => goToDrinkDetail(review.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DrinkList