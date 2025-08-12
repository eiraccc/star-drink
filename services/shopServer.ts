import {
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase-admin/firestore';
import { ShopType, ShopTypeFirestore } from '../types/shop';
import { firestoreAdmin } from '../lib/firebaseAdmin';

function formatAdminTimestampToUserLocalString(ts: {
  seconds: number;
  nanoseconds: number;
}): string {
  const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1_000_000);
  return date.toLocaleString();
}

export function formatDoc(doc: QueryDocumentSnapshot<DocumentData>): ShopType {
  const data = doc.data() as ShopTypeFirestore & {
    createdAt: { seconds: number; nanoseconds: number };
    updatedAt: { seconds: number; nanoseconds: number };
  };

  return {
    id: doc.id,
    ...data,
    createdAt: formatAdminTimestampToUserLocalString(data.createdAt),
    updatedAt: formatAdminTimestampToUserLocalString(data.updatedAt),
  };
}

export async function fetchShopsServer({
  shopId,
  shopSlug,
  isApproved,
}: {
  shopId?: string;
  shopSlug?: string;
  isApproved?: boolean;
}): Promise<ShopType[]> {
  let q: CollectionReference<DocumentData> | Query<DocumentData> =
    firestoreAdmin.collection('shops');
  if (shopId) {
    q = q.where('__name__', '==', shopId); // server not use documentId()
  }
  if (shopSlug) {
    q = q.where('slug', '==', shopSlug);
  }
  if (isApproved !== undefined) {
    q = q.where('isApproved', '==', isApproved);
  }

  const snapshot = await q.get();
  return snapshot.docs.map(formatDoc);
}
