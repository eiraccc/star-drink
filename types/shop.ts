import { Timestamp, FieldValue } from "firebase/firestore";
import { DrinkReviewType } from "./drinkReview";

export interface ShopSubmittedType {
    submittedName: string;
    submittedNote: string;
    submittedBy: string;
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
    submittedByRole: 'user' | 'admin'
}

export interface ShopTypeFirestore extends ShopSubmittedType, ShopNameSlugType {
    description: string;
    isApproved: boolean;
    createdAt: Timestamp
    updatedAt: Timestamp | FieldValue;
    submittedByRole: 'user' | 'admin'
}

export interface ShopTypeWithReview extends ShopType {
    reviews: DrinkReviewType[];
    totalReviews: number,
    averageRating: number
}

export type ShopFormType = Omit<ShopType, 'id' | 'createdAt' | 'updatedAt'>

export interface AliasLabelType {
  value: string;
  label: string;
}