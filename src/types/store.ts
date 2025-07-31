import { Timestamp, FieldValue } from "firebase/firestore";

export interface storeSubmittedType {
    submittedName: string;
    submittedNote: string;
    submittedBy: string;
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