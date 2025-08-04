import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { getStoresByQuery } from "../utils/storesService"
import { StoreTypeWithReview } from "../types/store";
import { useDrinkReview } from "../context/DrinkReviewContext";
import StoreCard from "../component/StoreCard";
import LoadingSection from "../component/LoadingSection";
import ErrorSection from "../component/ErrorSection";
import { RiSearchLine } from "react-icons/ri";

const StoreList = () => {
    const [stores, setStores] = useState<StoreTypeWithReview[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isLoading, setIsLoading] =useState(false);
    const { reviews } = useDrinkReview();

    const fetchStoreData = async() => {
        setIsLoading(true);
        try {
            const data = await getStoresByQuery({ isApproved: true });
            const storesWithReviews = data.map(store => {
                const storeReviews = reviews.filter(n => n.storeId === store.id);
                const totalReviews = storeReviews.length;
                const averageRating =
                totalReviews > 0
                    ? storeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
                    : 0;
        
                return {
                    ...store,
                    reviews: storeReviews,
                    totalReviews,
                    averageRating,
                };
            });

            setStores(storesWithReviews);
        } catch (error) {
            console.log('get store error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStoreData();
    }, [reviews]);

    const navigate = useNavigate();
    const goToStoreDetail = (slug: string) => {
        navigate(`/store/${slug}`);
    };

    const filterStores = stores.filter(store => {
        return store.nameEn.toLowerCase().includes(searchValue.toLowerCase());
    });

    return (
        <section className="p-6 pb-10">
            <div className="sm:p-6 lg:p-8">
                <div className="mb-5 flex items-center gap-2 border-2 border-surface-light focus-within:border-primary rounded-full px-4 py-2 w-full">
                    <RiSearchLine className="text-text font-bold" />
                    <input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        type="text"
                        placeholder="Search stores..."
                        className="flex-1 bg-transparent text-sm text-primary placeholder-surface-light outline-none"
                    />
                </div>

                {isLoading && <LoadingSection />}

                {filterStores.length > 0 && !isLoading && <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterStores.map(store => (
                            <StoreCard
                                key={store.id}
                                data={store}
                                onClick={() => goToStoreDetail(store.slug)}
                            />
                        ))}
                    </div>
                </>}

                {!filterStores.length && !isLoading &&  (
                    stores.length > 0 ? (
                        <ErrorSection
                            errorMsg='Hmm… no stores found. Maybe try different filters.'
                        />
                    ) : (
                        <ErrorSection
                            errorMsg={`Oops! No stores here yet.`}
                        />
                    )
                )}
            </div>
        </section>
    )
}

export default StoreList