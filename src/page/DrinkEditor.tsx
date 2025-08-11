'use client';
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from "../component/StarRating"
import { DrinkReviewFormType, IceLevel, SugarLevel, DrinkRatingType } from "../types/drinkReview"
import { sugarOptions, iceOptions, toppingOptions } from '../constants/drink'
import { MdArrowBackIos } from "react-icons/md";
import { BaseSelectOptionType } from '../types/selectOptionType';
import StepSelector from '../component/StepSelector';
import ErrorSection from '../component/ErrorSection';
import LoadingOverlay from '../component/LoadingOverlay';
import { useDrinkReview } from "../context/DrinkReviewContext";
import { getShopsByQuery } from '../utils/shopService';
import AddShopModal from '../component/AddShopModal';
import ShopSelect, { OptionTypeWithApprovalStatus } from '../component/ShopSelect';
import MultiSelect from '../component/MultiSelect';
import { toast } from 'react-toastify';
import { useForm, Controller } from "react-hook-form";

const DrinkEditor = ({ drinkId }: { drinkId?: string }) => {
  const router = useRouter();
  const isEdit = Boolean(drinkId);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { reviews, addReview, editReview, isLoadingReview } = useDrinkReview();
  const [showToppingOptions, setShowToppingOptions] = useState<BaseSelectOptionType[]>(toppingOptions);
  const [toppingSelected, setToppingSelected] = useState<BaseSelectOptionType[]>([]);
  const [shopOptions, setShopOptions] = useState<OptionTypeWithApprovalStatus[]>([]);
  const [showAddShoptModal, setShowAddShoptModal] = useState<boolean>(false);
  const [drinkIdError, setDrinkIdError] = useState<boolean>(false);

  useEffect(() => {
    if (isEdit && drinkId) {
      // edit
      const currentDrink = reviews.find(n => n.id === drinkId);
      if (currentDrink) {
        setDrinkIdError(false);

        const { createdAt, updatedAt, userId,...editData } = currentDrink;

        // set old toppings
        editData.toppings.forEach(topping => {
          addNewTopping(topping);
        });

        // set old shop
        getShopsAndSetOptions(editData);

        // set old data
        setValue('drinkName', editData.drinkName);
        setValue('rating', editData.rating);
        setValue('sugar', editData.sugar);
        setValue('ice', editData.ice);
        setValue('comment', editData.comment);
      } else {
        setDrinkIdError(true);
        getShopsAndSetOptions(null);
        reset(); // reset form
      }
    } else {
      // add
      setDrinkIdError(false);
      setToppingSelected([]);
      getShopsAndSetOptions(null);
      reset();  // reset form
    }
  }, [drinkId, reviews, isEdit]);

  const getShopsAndSetOptions = async(editData: DrinkReviewFormType | null) => {
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
          setValue('shopInfo', matchedShop);
        } else {
          const newOption = {
            label: editData.shopName,
            value: editData.shopId,
            isApproved: false
          };
          shopList.push(newOption);
          setValue('shopInfo', newOption);
        }
      } else {
        setValue('shopInfo', null);
      }

      setShopOptions(shopList);
    } catch (error) {
      console.log('get shop error')
    }
 };

  const handleAddShop = (newId: string, newName: string) => {
    const newOption = {
      value: newId,
      label: newName,
      isApproved: false
    };
    setShopOptions([...shopOptions, newOption]);
    setValue('shopInfo', newOption);
    setShowAddShoptModal(false);
  };


  const addNewTopping = useCallback((newTopping:string)  => {
    const newToppingValue = newTopping.trim().toLowerCase().replace(/\s+/g, '-');
    const newOption:BaseSelectOptionType = {
      value: newToppingValue,
      label: newTopping.replace(' ', '\n')
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
  const updataToppings = (newToppings: BaseSelectOptionType[]) => {
    setToppingSelected(newToppings);
  };

  const concatSubmittedData = (data: DrinkForm): DrinkReviewFormType => {
    let { shopInfo, ...newData } = data;
    const submittedData: DrinkReviewFormType = {
      ...newData,
      toppings: toppingSelected.map(n => n.value),
      shopId: shopInfo?.value ?? '',
      shopName: shopInfo?.label ?? '',
    };
  
    return submittedData;
  };

  const handleAdd = async (data: DrinkForm) => {
    const submittedData = concatSubmittedData(data);
    try {
      await addReview(submittedData);
      toast.success('Drink added successfully!');
      router.push('/');
    } catch (error) {
      toast.error("Failed to add drink. Please try again.");
    }
  };

  const handleEdit = async (data: DrinkForm) => {
    const submittedData = concatSubmittedData(data);
    try {
      if (drinkId && submittedData) {
        await editReview(drinkId, submittedData);
        toast.success('Drink updated successfully!');
        router.push(`/drink/${drinkId}`);
      }
    } catch (error) {
      toast.error("Failed to update drink. Please try again.");
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    router.push(isEdit ? `/drink/${drinkId}` : '/');
  };

  type DrinkForm = {
    drinkName: string,
    shopInfo: OptionTypeWithApprovalStatus | null,
    rating: DrinkRatingType,
    sugar: SugarLevel,
    ice: IceLevel,
    comment: string
  }

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid }
  } = useForm<DrinkForm>({
    mode: "onChange",
    defaultValues: {
      drinkName: '',
      shopInfo: null,
      rating: 0,
      sugar: 100,
      ice: 100,
      comment: ''
    }
  });

  return (
    <section className='flex justify-center p-6 pb-10'>
        {isClient ? <div className='w-full md:max-w-[500px]'>
          <AddShopModal
            isOpen={showAddShoptModal}
            onClose={() => setShowAddShoptModal(false)}
            onAdd={handleAddShop}
          />

          <Link href="/" className='text-secondary flex items-center mb-4'>
            <MdArrowBackIos />Back home
          </Link>

          {isLoadingReview && <LoadingOverlay />}

          { !isLoadingReview && (
            drinkIdError ? (
              <ErrorSection
                errorMsg='Uh-oh, no drinks here yet!'
                btnActionHome={true}
              />
            ) : (
              <form onSubmit={handleSubmit(isEdit ? handleEdit : handleAdd)}>
                <div className="mb-2">
                  <label
                    htmlFor="drinkName"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Drink Name:</label>
                  <input
                    type="text"
                    id="drinkName"
                    {...register("drinkName", { required: true })}
                    className='w-full md:max-w-[500px] border-2 border-primary rounded-full py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
                  />
                  {errors.drinkName && (
                    <p className="ml-1 text-danger text-xs">Required</p>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="shopInfo"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Shop Name:</label>
                  <Controller
                    name="shopInfo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ShopSelect
                        options={shopOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onAddShop={() => setShowAddShoptModal(true)}
                      />
                    )}
                  />
                  {errors.shopInfo && (
                    <p className="ml-1 text-danger text-xs">Required</p>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="rating"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Rating:</label>
                    <Controller
                      name="rating"
                      control={control}
                      rules={{
                        validate: (value) => value > 0 || "Please provide a rating before submitting",
                      }}
                      render={({ field }) => (
                        <StarRating
                          iconSize={30}
                          rating={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.rating && (
                      <p className="text-xs text-danger mt-1">{errors.rating.message}</p>
                    )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="ice"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Ice:</label>
                  <Controller
                    name="ice"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <StepSelector
                        options={iceOptions}
                        selectedValue={field.value}
                        onChange={field.onChange}
                        activeColorClass="bg-secondary-ice border-secondary-ice"
                        baseColorClass="bg-background border-primary-ice"
                        lineColorClass="bg-primary-ice"
                        labelColorClass="text-text-ice"
                      />
                    )}
                  />
                  {errors.ice && (
                    <p className="text-xs text-danger mt-1">{errors.ice.message}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="sugar"
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Sugar:</label>
                  <Controller
                    name="sugar"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <StepSelector
                        options={sugarOptions}
                        selectedValue={field.value}
                        onChange={field.onChange}
                        activeColorClass="bg-secondary-sugar border-secondary-sugar"
                        baseColorClass="bg-background border-primary-sugar"
                        lineColorClass="bg-primary-sugar"
                        labelColorClass="text-text-sugar"
                      />
                    )}
                  />
                  {errors.sugar && (
                    <p className="text-xs text-danger mt-1">{errors.sugar.message}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label htmlFor="toppings" className='mb-1 block'>Toppings:</label>
                  <MultiSelect<BaseSelectOptionType>
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
                    className="mb-1 after:content-['*'] after:ml-0.5 after:text-primary block"
                  >Comment:</label>
                  <textarea
                    id="comment"
                    {...register("comment", { required: true })}
                    className='w-full md:max-w-[500px] border-2 border-primary rounded-xl py-1 bg-transparent text-secondary p-2 focus:outline-none focus:border-secondary'
                  />
                  {errors.comment && <p className="ml-1 text-danger text-xs">Required</p>}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="w-1/2 px-4 py-2 border rounded-md text-sm text-text-secondary border-text-secondary hover:bg-surface"
                    onClick={(e) => handleCancel(e)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 px-4 py-2 rounded-md text-sm text-contrast bg-primary hover:opacity-80 disabled:opacity-50"
                  >
                    {isEdit ? 'Edit' : 'Add'}
                  </button>
                </div>
              </form>
            )
          )
          }
        </div>: <LoadingOverlay />}
    </section>
  )
}

export default DrinkEditor