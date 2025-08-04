import { Timestamp, FieldValue } from "firebase/firestore";
import { DrinkReviewType } from "./drinkReview";

export interface storeSubmittedType {
    submittedName: string;
    submittedNote: string;
    submittedBy: string;
    submittedByRole: 'user' | 'admin'
}

export interface storeNameSlugType {
    nameEn: string;
    nameZh: string;
    slug: string;
    alias: string[];
}

export interface StoreType extends storeSubmittedType, storeNameSlugType {
    id: string;
    description: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StoreTypeFirestore extends storeSubmittedType, storeNameSlugType {
    description: string;
    isApproved: boolean;
    createdAt: Timestamp
    updatedAt: Timestamp | FieldValue;
}

export interface StoreTypeWithReview extends StoreType {
    reviews: DrinkReviewType[];
    totalReviews: number,
    averageRating: number
}

export type StoreTypeFormType = Omit<StoreType, 'id' | 'createdAt' | 'updatedAt'>

export interface AliasLabelType {
  value: string;
  label: string;
}