import { useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useDrinkReview } from "../context/DrinkReviewContext";
import ShopCard from "../component/ShopCard";
import LoadingSection from "../component/LoadingSection";
import ErrorSection from "../component/ErrorSection";
import { RiSearchLine } from "react-icons/ri";
import { useShop } from "../context/ShopContext";

const ShopList = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');
    const { reviewsByShopId, isLoadingReview } = useDrinkReview();
    const { approvedShops, isLoadingApprovedShop } = useShop();

    const isLoading = isLoadingReview || isLoadingApprovedShop;

    const shops = useMemo(() => {
        return approvedShops.map(shop => {
            const shopReviews = reviewsByShopId[shop.id] || [];
            const totalReviews = shopReviews.length;
            const averageRating =
            totalReviews > 0
                ? shopReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
                : 0;
    
            return {
                ...shop,
                reviews: shopReviews,
                totalReviews,
                averageRating,
            };
        });
    },  [approvedShops, reviewsByShopId]);

    const filterShops = shops.filter(shop => {
        return shop.nameEn.toLowerCase().includes(searchValue.toLowerCase());
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
                        placeholder="Search shops..."
                        className="flex-1 bg-transparent text-sm text-primary placeholder-surface-light outline-none"
                    />
                </div>

                {isLoading && <LoadingSection />}

                {filterShops.length > 0 && !isLoading && <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterShops.map(shop => (
                            <ShopCard
                                key={shop.id}
                                data={shop}
                                onClick={() => navigate(`/shop/${shop.slug}`)}
                            />
                        ))}
                    </div>
                </>}

                {!filterShops.length && !isLoading &&  (
                    shops.length > 0 ? (
                        <ErrorSection
                            errorMsg='Hmm… no shops found. Maybe try different filters.'
                        />
                    ) : (
                        <ErrorSection
                            errorMsg={`Oops! No shop here yet.`}
                        />
                    )
                )}
            </div>
        </section>
    )
}

export default ShopList