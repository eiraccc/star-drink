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
import { formatInTimeZone } from "date-fns-tz";
import {
  DrinkReviewType,
  DrinkReviewFormType,
  DrinkReviewFirestoreData
} from "../types/drinkReview";

const reviewsCollection = collection(db, "drinkReviews");

// Format the time according to the user's time zone
function formatTimestampToUserLocalString(timestamp: Timestamp | undefined | null): string {
  if (!timestamp) return '';
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return formatInTimeZone(timestamp.toDate(), userTimeZone, "yyyy-MM-dd HH:mm:ss");
}

export async function getReviews(): Promise<DrinkReviewType[]> {
  try {
    const snapshot = await getDocs(reviewsCollection);
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
    await addDoc(reviewsCollection, reviewData);
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