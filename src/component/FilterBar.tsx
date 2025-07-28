import MultiSelect from '../component/MultiSelect';
import {
  sugarOptions,
  iceOptions,
  SugarIceLabelType,
  toppingOptions,
  ToppingLabelType,
} from '../constants/drink';
import { SortKey, SortOrder } from '../types/sorting';
import { RxCaretSort } from 'react-icons/rx';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearchLine,
  RiTimeLine,
} from 'react-icons/ri';
import { FaRegStar } from 'react-icons/fa';

type propsType = {
  searchValue: string;
  setSearchValue: (val: string) => void;
  selectedIce: SugarIceLabelType[];
  setSelectedIce: (val: SugarIceLabelType[]) => void;
  selectedSugar: SugarIceLabelType[];
  setSelectedSugar: (val: SugarIceLabelType[]) => void;
  selectedTopping: ToppingLabelType[];
  setSelectedTopping: (val: ToppingLabelType[]) => void;
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
  return (
    <div className="flex flex-col gap-4 p-3 mb-3">
      {/* input */}
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
