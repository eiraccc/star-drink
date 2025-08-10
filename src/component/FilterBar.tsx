import MultiSelect, { simpleLabelType } from '../component/MultiSelect';
import {
  sugarOptions,
  iceOptions,
  SugarIceLabelType,
  toppingOptions,
} from '../constants/drink';
import { SortKey, SortOrder } from '../types/sorting';
import { RxCaretSort } from 'react-icons/rx';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearchLine,
  RiTimeLine,
  RiFilterLine,
  RiArrowUpSFill,
} from 'react-icons/ri';
import { FaRegStar } from 'react-icons/fa';
import { useState } from 'react';

type propsType = {
  searchValue: string;
  setSearchValue: (val: string) => void;
  selectedIce: SugarIceLabelType[];
  setSelectedIce: (val: SugarIceLabelType[]) => void;
  selectedSugar: SugarIceLabelType[];
  setSelectedSugar: (val: SugarIceLabelType[]) => void;
  selectedTopping: simpleLabelType[];
  setSelectedTopping: (val: simpleLabelType[]) => void;
  sort: { key: SortKey; order: SortOrder };
  toggleSort: (key: SortKey) => void;
};

const FilterBar = ({
  searchValue,
  setSearchValue,
  setSelectedIce,
  selectedIce,
  selectedSugar,
  setSelectedSugar,
  selectedTopping,
  setSelectedTopping,
  sort,
  toggleSort,
}: propsType) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className='flex gap-2 items-center'>
        {/* search input */}
        <div className="flex items-center gap-2 border-2 border-surface focus-within:border-primary rounded-full px-4 py-2 w-full">
            <RiSearchLine className="text-text font-bold" />
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search drinks..."
              className="flex-1 bg-transparent text-sm text-primary placeholder-surface outline-none"
            />
          </div>
          {isMobileFilterOpen ? <RiArrowUpSFill
            className='sm:hidden text-primary'
            size={28}
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          />
          : <RiFilterLine
            className='sm:hidden text-primary'
            size={28}
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          />}
      </div>

      {/* filter */}
      <div
        className={`
          flex flex-col sm:flex-row items-start z-10
          transition-all duration-300 ease-in-out transform
          sm:max-h-none sm:opacity-100 sm:translate-y-0
          ${isMobileFilterOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}
        `}
      >
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
          <MultiSelect<simpleLabelType>
            options={toppingOptions}
            selected={selectedTopping}
            setSelected={setSelectedTopping}
            placeholder="Toppings (any)"
          />
        </div>
      </div>
      
      {/* sort */}
      <div className="flex pl-2">
        <button
          onClick={() => toggleSort('rating')}
          className={`mr-3 flex items-center justify-center ${
            sort.key === 'rating' && 'font-bold'
          }`}>
          <FaRegStar className="mr-1" />
          Rating
          {sort.key !== 'rating' ? (
            <RxCaretSort />
          ) : sort.order === 'desc' ? (
            <RiArrowUpSLine />
          ) : (
            <RiArrowDownSLine />
          )}
        </button>
        <button
          onClick={() => toggleSort('postTime')}
          className={`flex items-center justify-center ${
            sort.key === 'postTime' && 'font-bold'
          }`}>
          <RiTimeLine className="mr-1" />
          Post Time
          {sort.key !== 'postTime' ? (
            <RxCaretSort />
          ) : sort.order === 'desc' ? (
            <RiArrowUpSLine />
          ) : (
            <RiArrowDownSLine />
          )}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
