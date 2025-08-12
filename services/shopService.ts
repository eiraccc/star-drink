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
  documentId,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  ShopType,
  ShopTypeFirestore,
  ShopSubmittedType,
  ShopFormType,
} from '../src/types/shop';
import { formatTimestampToUserLocalString } from '../utils/timeFormat';
import { generateSlug } from '../utils/autoSlug';

const shopRef = collection(db, 'shops');

function formatDoc(doc: QueryDocumentSnapshot<DocumentData>): ShopType {
  const data = doc.data() as ShopTypeFirestore & {
    createdAt: Timestamp;
    updatedAt: Timestamp
  };
  return {
    id: doc.id,
    ...data,
    createdAt: formatTimestampToUserLocalString(data.createdAt),
    updatedAt: formatTimestampToUserLocalString(data.updatedAt),
  };
};


// 監聽已審核店家（onSnapshot）
export function listenApprovedShops(
  callback: (shops: ShopType[]) => void,
  errorCallback?: (error: Error) => void
) {
  const q = query(shopRef, where('isApproved', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const shops = snapshot.docs.map(formatDoc);
      callback(shops);
    },
    (error) => {
      if (errorCallback) errorCallback(error);
    }
  );
};

export function listenAllShops(
  callback: (shops: ShopType[]) => void,
  errorCallback?: (error: Error) => void
) {
  return onSnapshot(
    shopRef,
    (snapshot) => {
      const shops = snapshot.docs.map(formatDoc);
      callback(shops);
    },
    (error) => {
      if (errorCallback) errorCallback(error);
    }
  );
};

export async function getShops(): Promise<ShopType[]> {
  try {
    const snapshot = await getDocs(shopRef);
    return snapshot.docs.map(formatDoc);
  } catch (error) {
    console.error('get reviews error:', error);
    throw error;
  }
}

export async function getShopsByQuery({
  shopId,
  shopSlug,
  isApproved
}: {
  shopId?: string,
  shopSlug?: string,
  isApproved?: boolean
}): Promise<ShopType[]> {
  try {
    const conditions: QueryConstraint[] = [];
    if (shopId) {
      conditions.push(where(documentId(), "==", shopId));
    }

    if (shopSlug) {
      conditions.push(where("slug", "==", shopSlug));
    }
  
    if (isApproved !== undefined) {
      conditions.push(where("isApproved", "==", isApproved));
    }
  
    const q = query(shopRef, ...conditions);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(formatDoc);
  } catch (error) {
    console.error('get reviews error:', error);
    throw error;
  }
}

export async function addShopByName({
  submittedName,
  submittedNote,
  submittedBy,
}: ShopSubmittedType) {
  try {
    const shopData: ShopTypeFirestore = {
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
    const result = await addDoc(shopRef, shopData);
    return result.id;
  } catch (error) {
    console.error('add error:', error);
    throw error;
  }
}

export async function addShop(data: ShopFormType) {
    try {
      const shopData: ShopTypeFirestore = {
        ...data,
        submittedByRole: 'admin',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };
      const result = await addDoc(shopRef, shopData);
      return result.id;
    } catch (error) {
      console.error('add error:', error);
      throw error;
    }
  }

export async function approveShop(shopId: string) {
  try {
    const ref = doc(db, 'shops', shopId);
    await updateDoc(ref, {
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('update error:', error);
    throw error;
  }
}

export async function editShop(data: Omit<ShopType, 'createdAt'>) {
  try {
    const ref = doc(db, 'shops', data.id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('update error:', error);
    throw error;
  }
}

export async function deleteShop(shopId: string) {
  try {
    const ref = doc(db, 'shops', shopId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('delete error:', error);
    throw error;
  }
}
