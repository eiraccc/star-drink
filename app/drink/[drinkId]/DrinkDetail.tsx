'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from '../../../components/StarRating';
import ErrorSection from '../../../components/ErrorSection';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { DrinkReviewType } from "../../../types/drinkReview"
import { iceLabelMap, sugarLabelMap, iceOptions, sugarOptions } from "../../../constants/drink";
import { MdArrowBackIos } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useDrinkReview } from "../../../context/DrinkReviewContext";
import { ShopType } from '../../../types/shop';
import { toast } from 'react-toastify';
import ShopStatusTag from '../../../components/ShopStatusTag';
import { getShopsByQuery } from '../../../services/shopService';

type ShopStatusType = 'approved' | 'pending' | 'removed' | '';

const DrinkDetail = ({ drinkId } : { drinkId: string }) => {
  const router = useRouter();
  const [drinkData, setDrinkData] = useState<DrinkReviewType | null>(null);
  const [shopStatus, setShopStatus] = useState<ShopStatusType>('');
  const [shopData, setShopData] = useState<ShopType | null>(null);
  const { reviews, deleteReview, isLoadingReview } = useDrinkReview();

  useEffect(() => {
    // get data
    const drinkData = reviews.find(n => n.id === drinkId) || null;
    setDrinkData(drinkData);
  }, [reviews]);

  useEffect(() => {
    // get shop status
    if(drinkData?.shopId) {
      getShopInfo(drinkData.shopId);
    }
  }, [drinkData]);

  const getShopInfo = async(shopId: string) => {
      const shopInfo = await getShopsByQuery({shopId: shopId});
      if(shopInfo?.length) {
          const shopData = shopInfo[0];
          setShopStatus(shopData.isApproved ? 'approved' : 'pending');
          setShopData(shopData);
          // TODO: if shop change name, shoule change name field in drink data
      } else {
          setShopStatus('removed');
      }
  };

  const iceOpacity:number = drinkData ? (iceOptions.find(n => n.value === drinkData.ice)?.opacity || 0) : 0;
  const sugarOpacity:number = drinkData ? (sugarOptions.find(n => n.value === drinkData.sugar)?.opacity || 0) : 0;

  const handleDelete = async () => {
    try {
      if (drinkId) {
        await deleteReview(drinkId);
        toast.success('Drink deleted successfully!');
        router.push('/');
      }
    } catch (error) {
      toast.error("Failed to delete drink. Please try again.");
    }
  };

  return (
    <section className='flex justify-center p-6 pb-10'>
      <div className='w-full md:max-w-[500px]'>
        <Link href="/" className='text-secondary flex items-center mb-4'>
          <MdArrowBackIos />Back home
        </Link>


        {
          isLoadingReview ? <LoadingOverlay /> : drinkData ? (
            <div>
              <h2 className="text-text text-lg font-bold flex items-center">
                {drinkData.drinkName}
              </h2>
              <div className='flex items-center'>
                {drinkData.shopId && shopStatus === 'approved' && shopData?.slug ? (
                  <Link href={`/shop/${shopData.slug}`} className="text-text-secondary italic mr-2 underline">
                    {drinkData.shopName}
                  </Link>
                ) : (
                  <p className="text-text-secondary italic mr-2">{drinkData.shopName}</p>
                )}
                <ShopStatusTag shopStatus={shopStatus} />
              </div>
              <StarRating readonly={true} rating={drinkData.rating} />
              <div className='mt-1'>
                <label htmlFor="ice" className='mr-2'>Ice:</label>
                <div className={`bg-primary-ice/${iceOpacity} text-text-ice inline-block p-1 text-xs mr-1`}>{iceLabelMap[drinkData.ice]}</div>
              </div>
              <div className='mt-1'>
                <label htmlFor="sugar" className='mr-2'>Sugar:</label>
                <div className={`bg-primary-sugar/${sugarOpacity} text-text-sugar inline-block p-1 text-xs mr-1`}>{sugarLabelMap[drinkData.sugar]}</div>
              </div>
              <div className='mt-1'>
                <label htmlFor="toppings" className='mr-2'>Toppings:</label>
                {drinkData.toppings.length ? drinkData.toppings.map(topping => {
                      return <div key={topping} className={`bg-primary text-background inline-block p-1 text-xs mr-1`}>{topping}</div>
                  }) : <ImCross className='text-primary inline-block' />}
              </div>

              <p className="text-text-secondary text-sm mt-2">{drinkData.comment}</p>
              <hr className="border-t border-secondary my-4" />
              <p className="text-text-secondary text-xs mt-2">
                Post by <span className='text-primary'>{drinkData.userId}</span> on {drinkData.createdAt}
              </p>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => router.push(`/drink/${drinkId}/edit`)}
                  className="bg-primary text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-danger text-background px-5 py-2 rounded-md text-sm hover:opacity-90"
                >
                  Delete
                </button>
              </div>
              
            </div>
          ) : (
            <ErrorSection
              errorMsg='Uh-oh, no drink here!'
              btnActionHome={true}
            />
          )
        }
      </div>
    </section>
  )
}

export default DrinkDetail