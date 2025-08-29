import { DrinkReviewType } from "./drinkReview";

export interface ShopSubmittedType {
    submittedName: string;
    submittedNote: string;
    submittedBy: string;
}

export interface ShopAddSubmittedType extends ShopSubmittedType {
    submittedByRole: 'user'
}

export interface ShopNameSlugType {
    nameEn: string;
    nameZh: string;
    slug: string;
    alias: string[];
}

export interface ShopType extends ShopSubmittedType, ShopNameSlugType {
    shopId: string;
    description: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    submittedByEmail: string,
    submittedByRole: 'user' | 'admin'
}

export interface ShopTypeWithReview extends ShopType {
    reviews: DrinkReviewType[];
    totalReviews: number,
    averageRating: number
}

export type ShopFormType = Omit<ShopType, 'shopId' | 'createdAt' | 'updatedAt'>
export type ShopEditType = Omit<ShopType, 'createdAt' | 'updatedAt'>

export interface AliasLabelType {
  value: string;
  label: string;
}