'use client';

import { useEffect } from 'react';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseApp } from '../lib/firebase';

export default function AnalyticsInit() {
  useEffect(() => {
    async function init() {
      if (process.env.NEXT_PUBLIC_ENV !== "development" && await isSupported()) {
        getAnalytics(firebaseApp);
      }
    }
    init();
  }, []);

  return null;
}