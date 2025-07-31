import {
    getDocs,
    addDoc,
    collection,
    serverTimestamp,
    Timestamp,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { StoreType, StoreTypeFirestore, storeSubmittedType } from "../types/store";
import { formatTimestampToUserLocalString } from "./timeFormat";
import { generateSlug } from "./autoSlug";

const storeRef = collection(db, "stores");

export async function getStores(): Promise<StoreType[]> {
    try {
      const snapshot = await getDocs(storeRef);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as StoreTypeFirestore & {
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

  export async function addStore({ submittedName, submittedNote, submittedBy }: storeSubmittedType) {
    try {
      const storeData: StoreTypeFirestore = {
        ...generateSlug(submittedName),
        submittedName,
        submittedNote,
        submittedBy,
        description: '',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const result = await addDoc(storeRef, storeData);
      return result.id;
    } catch (error) {
      console.error("add error:", error);
      throw error;
    }
  }