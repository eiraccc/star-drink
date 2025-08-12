import {
  CollectionReference,
  Query,
} from 'firebase-admin/firestore';
import { firestoreAdmin } from '../lib/firebaseAdmin';
import {
  DrinkReviewType,
  DrinkReviewFirestoreData,
} from '../types/drinkReview';

function formatAdminTimestampToUserLocalString(ts: {
  seconds: number;
  nanoseconds: number;
}): string {
  const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1_000_000);
  return date.toLocaleString();
}

type GetReviewsParams = {
  shopId?: string;
  shopSlug?: string;
  drinkName?: string;
};

export async function fetchReviewsServer({
  shopId,
  shopSlug,
  drinkName,
}: GetReviewsParams): Promise<DrinkReviewType[]> {
  let q: CollectionReference | Query =
    firestoreAdmin.collection('drinkReviews');

  if (shopId) {
    q = q.where('shopId', '==', shopId);
  }
  if (shopSlug) {
    q = q.where('slug', '==', shopSlug);
  }
  if (drinkName) {
    q = q.where('drinkName', '==', drinkName);
  }

  const snapshot = await q.get();

  return snapshot.docs.map(doc => {
    const data = doc.data() as DrinkReviewFirestoreData & {
      createdAt: { seconds: number; nanoseconds: number };
      updatedAt: { seconds: number; nanoseconds: number };
    };

    return {
      id: doc.id,
      ...data,
      createdAt: formatAdminTimestampToUserLocalString(data.createdAt),
      updatedAt: formatAdminTimestampToUserLocalString(data.updatedAt),
    };
  });
}
