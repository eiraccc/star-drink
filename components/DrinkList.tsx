'use client';
import { useState, useEffect, useMemo } from "react"
import { useRouter } from 'next/navigation';
import { SortKey, SortType } from "../types/sorting";
import { DrinkReviewType } from "../types/drinkReview";
import { sugarOptions, iceOptions, SugarIceLabelType } from '../constants/drink'
import DrinkCard from "./DrinkCard";
import ErrorSection from "./ErrorSection";
import FilterBar from "./FilterBar";
import LoadingSection from "./LoadingSection";
import { BaseSelectOptionType } from "../types/selectOptionType";
import { useReviews } from "../services/reviewClient";

const DrinkList = ({initReviewData}: {initReviewData: DrinkReviewType[]}) => {
  const { data: reviews, isLoading: isLoadingReview } = useReviews({initReviewData: initReviewData});
  console.log('allReviews',reviews)
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedIce, setSelectedIce] = useState<SugarIceLabelType[]>(iceOptions);
  const [selectedSugar, setSelectedSugar] = useState<SugarIceLabelType[]>(sugarOptions);
  const [selectedTopping, setSelectedTopping] = useState<BaseSelectOptionType[]>([])
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
    <section className="p-6 pb-10">
      {isClient && <div className="sm:p-6 lg:p-8">
        <FilterBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedIce={selectedIce}
          setSelectedIce={setSelectedIce}
          selectedSugar={selectedSugar}
          setSelectedSugar={setSelectedSugar}
          selectedTopping={selectedTopping}
          setSelectedTopping={setSelectedTopping}
          sort={sort}
          toggleSort={toggleSort}
        />

        {isLoadingReview && <LoadingSection />}
        
        {sortReviews.length > 0 && !isLoadingReview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortReviews.map((review) => (
              <DrinkCard
                key={review.reviewId}
                data={review}
                onClick={() => router.push(`/drink/${review.reviewId}`)}
              />
            ))}
          </div>
        )}

        {!sortReviews.length && !isLoadingReview &&  (
          reviews.length > 0 ? (
            <ErrorSection
              errorMsg='Hmm… no drinks found. Maybe try different filters.'
            />
          ) : (
            <ErrorSection
              errorMsg={`Oops! No drinks here yet. Let's add some delicious ones!`}
            />
          )
        )}
      </div>}
    </section>
  )
}

export default DrinkList