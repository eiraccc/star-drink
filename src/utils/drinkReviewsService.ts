import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";
import {
  DrinkReviewType,
  DrinkReviewFormType,
  DrinkReviewFirestoreData
} from "../types/drinkReview";
import { formatTimestampToUserLocalString } from "./timeFormat";

const reviewsRef = collection(db, "drinkReviews");

export async function getReviews(): Promise<DrinkReviewType[]> {
  try {
    const snapshot = await getDocs(reviewsRef);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as Omit<DrinkReviewType, "id" | "createdAt" | "updatedAt"> & {
        createdAt: Timestamp;
        updatedAt: Timestamp;
      };
      return {
        id: doc.id,
        ...data,
        createdAt: formatTimestampToUserLocalString(data.createdAt),
        updatedAt: formatTimestampToUserLocalString(data.updatedAt),
      };
    });
  } catch (error) {
    console.error("get reviews error:", error);
    throw error;
  }
}

export async function addReview(data: Omit<DrinkReviewType, "id" | "createdAt" | "updatedAt">) {
  try {
    const reviewData: DrinkReviewFirestoreData = {
      ...data,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    await addDoc(reviewsRef, reviewData);
  } catch (error) {
    console.error("add error:", error);
    throw error;
  }
}

export async function updateReview(id: string, data: DrinkReviewFormType) {
  try {
    const ref = doc(db, "drinkReviews", String(id));
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("update error:", error);
    throw error;
  }
}

export async function deleteReview(id: string) {
  try {
    const ref = doc(db, "drinkReviews", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("delete error:", error);
    throw error;
  }
}