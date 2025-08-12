import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  DrinkReviewType,
  DrinkReviewFormType,
  DrinkReviewFirestoreData
} from "../types/drinkReview";
import { formatTimestampToUserLocalString } from "../utils/timeFormat";

const reviewsRef = collection(db, "drinkReviews");

export async function getReviews({
  shopId,
  shopSlug,
  drinkName,
}: {
  shopId?: string,
  shopSlug?: string,
  drinkName?: string
}): Promise<DrinkReviewType[]> {
  try {
    const conditions: QueryConstraint[] = [];
    if (shopId) {
      conditions.push(where("shopId", "==", shopId));
    }
  
    if (shopSlug) {
      conditions.push(where("slug", "==", shopSlug));
    }

    if (drinkName) {
      conditions.push(where("drinkName", "==", drinkName));
    }
  
    const q = query(reviewsRef, ...conditions);
    const snapshot = await getDocs(q);
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