import {
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryConstraint,
  collection,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  StoreType,
  StoreTypeFirestore,
  storeSubmittedType,
  StoreTypeFormType,
} from '../types/store';
import { formatTimestampToUserLocalString } from './timeFormat';
import { generateSlug } from './autoSlug';

const storeRef = collection(db, 'stores');

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
    console.error('get reviews error:', error);
    throw error;
  }
}

export async function getStoresByQuery({
  storeId,
  storeSlug,
  isApproved
}: {
  storeId?: string,
  storeSlug?: string,
  isApproved?: boolean
}): Promise<StoreType[]> {
  try {
    const conditions: QueryConstraint[] = [];
    if (storeId) {
      conditions.push(where("id", "==", storeId));
    }

    if (storeSlug) {
      conditions.push(where("slug", "==", storeSlug));
    }
  
    if (isApproved !== undefined) {
      conditions.push(where("isApproved", "==", isApproved));
    }
  
    const q = query(storeRef, ...conditions);
    const snapshot = await getDocs(q);
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
    console.error('get reviews error:', error);
    throw error;
  }
}

export async function addStoreByName({
  submittedName,
  submittedNote,
  submittedBy,
}: storeSubmittedType) {
  try {
    const storeData: StoreTypeFirestore = {
      ...generateSlug(submittedName),
      submittedName,
      submittedNote,
      submittedBy,
      submittedByRole: 'user',
      description: '',
      isApproved: false,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const result = await addDoc(storeRef, storeData);
    return result.id;
  } catch (error) {
    console.error('add error:', error);
    throw error;
  }
}

export async function addStore(data: StoreTypeFormType) {
    try {
      const storeData: StoreTypeFirestore = {
        ...data,
        submittedByRole: 'admin',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const result = await addDoc(storeRef, storeData);
      return result.id;
    } catch (error) {
      console.error('add error:', error);
      throw error;
    }
  }

export async function approveStore(storeId: string) {
  try {
    const ref = doc(db, 'stores', storeId);
    await updateDoc(ref, {
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('update error:', error);
    throw error;
  }
}

export async function editStore(data: Omit<StoreType, 'createdAt'>) {
  try {
    const ref = doc(db, 'stores', data.id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('update error:', error);
    throw error;
  }
}

export async function deleteStore(storeId: string) {
  try {
    const ref = doc(db, 'stores', storeId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('delete error:', error);
    throw error;
  }
}
