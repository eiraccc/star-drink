import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import StarRating from "../component/StarRating"
import { DrinkReviewFormType, IceLevel, SugarLevel } from "../types/drinkReview"
import { sugarOptions, iceOptions, toppingOptions, ToppingLabelType } from '../constants/drink'
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import MultiSelect from '../component/MultiSelect';
import StepSelector from '../component/StepSelector';
import ErrorSection from '../component/ErrorSection';
import LoadingOverlay from '../component/LoadingOverlay';
import { useDrinkReview } from "../context/DrinkReviewContext";
import { getShopsByQuery } from '../utils/shopService';
import AddShopModal from '../component/AddShopModal';
import ShopSelect, { OptionTypeWithApprovalStatus } from '../component/ShopSelect';


const DrinkEditor = () => {
  const { drinkId } = useParams<{ drinkId: string }>();
  const isEdit = Boolean(drinkId);
  const { reviews, addReview, editReview, isLoading } = useDrinkReview();

  const initDrinkReview: DrinkReviewFormType = {
    drinkName: '',
    shopName: '',
    shopId: '',
    rating: 0,
    sugar: 100,
    ice: 100,
    toppings: [],
    comment: ''
  }
  const [drinkData, setDrinkData] = useState<DrinkReviewFormType | null>(initDrinkReview);
  const [showToppingOptions, setShowToppingOptions] = useState<ToppingLabelType[]>(toppingOptions);
  const [toppingSelected, setToppingSelected] = useState<ToppingLabelType[]>([]);
  const [shopOptions, setShopOptions] = useState<OptionTypeWithApprovalStatus[]>([]);
  const [shopSelected, setShopSelected] = useState<OptionTypeWithApprovalStatus | null>(null);
  const [showAddShoptModal, setShowAddShoptModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!drinkId) return;
    if (isEdit) {
      // edit
      const currentDrink = reviews.find(n => n.id === drinkId);
      if (currentDrink) {
        const { createdAt, updatedAt, userId,...editData } = currentDrink;
        setDrinkData(editData);
        editData.toppings.forEach(topping => {
          addNewTopping(topping);
        });

        getShopsAndSetOptions(editData);
      } else {
        setDrinkData(null);
      }
    } else {
      // add
      setDrinkData(initDrinkReview);
      setToppingSelected([]);
    }
  }, [drinkId, reviews, isEdit]);

  const getShopsAndSetOptions = async(editData: DrinkReviewFormType) => {
    try {
      const data = await getShopsByQuery({isApproved: true});

      if (!data?.length) return;
      let shopList = data.map(shop => (
        {
          value: shop.id,
          label: shop.nameEn,
          isApproved: true
        }
      ));


      if(editData) {
        const matchedShop = shopList.find(n => n.value === editData.shopId);
        if(matchedShop) {
          setShopSelected(matchedShop);
        } else {
          const newOption = {
            label: editData.shopName,
            value: editData.shopId,
            isApproved: false
          };
          shopList.push(newOption);
          setShopSelected(newOption);
        }
      }

      setShopOptions(shopList);
    } catch (error) {
      console.log('get shop error')
    }
 };

  const putShopselected = (newOption: OptionTypeWithApprovalStatus) => {
    setShopSelected(newOption);

    if(!drinkData) return;
    setDrinkData({
      ...drinkData,
      shopId: shopSelected?.value || '',
      shopName: shopSelected?.label || ''
    })
  };

  const handleAddShop = (newId: string, newName: string) => {
    const newOption = {
      value: newId,
      label: newName,
      isApproved: false
    };
    setShopOptions([...shopOptions, newOption]);
    setShopSelected(newOption);
    setShowAddShoptModal(false);
  };

  

  const addNewTopping = useCallback((newTopping:string)  => {
    const newToppingValue = newTopping.trim().toLowerCase().replace(/\s+/g, '-');
    const newOption:ToppingLabelType = {
      value: newToppingValue,
      label: newTopping.replace(' ', '\n'),
      type: 'topping'
    };

    setShowToppingOptions(prev => {
      if (!prev.some(n => n.value === newToppingValue)) {
        return [...prev, newOption];
      }
      return prev;
    });
  
    setToppingSelected(prev => {
      if (!prev.some(n => n.value === newToppingValue)) {
        return [...prev, newOption];
      }
      return prev;
    });
  }, [setToppingSelected, setShowToppingOptions])

  // from selector update
  const updataToppings = (newToppings: ToppingLabelType[]) => {
    setToppingSelected(newToppings);
    drinkData && setDrinkData({...drinkData, toppings: newToppings.map(n => n.value)});
  };

  const handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    drinkData && await addReview(drinkData);
    navigate('/');
  };

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    (drinkId && drinkData) && await editReview(drinkId, drinkData);
    navigate(`/drink/${drinkId}`);
  };

  const handleCancel = () => {
    navigate(isEdit ? `/drink/${drinkId}` : '/');
  };

  return (
    <section className='flex justify-center p-6 pb-10'>
        <div className='w-full md:max-w-[500px]'>
          <AddShopModal
            isOpen={showAddShoptModal}
            onClose={() => setShowAddShoptModal(false)}
            onAdd={handleAddShop}
          />

          <Link to="/" className='text-secondary flex items-center mb-4'>
            <MdArrowBackIos />Back home
          </Link>

          { isLoading ? <LoadingOverlay /> : drinkData ? (
            <div>
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
                  htmlFor="shopName"
                  className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
                >Shop Name:</label>
                <ShopSelect
                  options={shopOptions}
                  value={shopSelected}
                  onChange={putShopselected}
                  onAddShop={() => setShowAddShoptModal(true)}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="rating"
                  className="mb-1 after:content-['*'] after:ml-0.5 after:text-secondary block"
                >Rating:</label>
                  <StarRating
                    rating={ drinkData.rating }
                    iconSize={30}
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
                  setSelected={updataToppings}
                  placeholder='Select toppings or add (type and press Enter)'
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
                  className="w-1/2 px-4 py-2 rounded-lg text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50"
                  onClick={(e) => isEdit ? handleEdit(e) : handleAdd(e)}
                >
                  {isEdit ? 'Edit' : 'Add'}
                </button>
              </div>
            </div>
          )
          : (
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

export default DrinkEditor