import { ReactNode } from 'react';
import type { Metadata } from 'next'
import { cookies } from 'next/headers';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { DrinkReviewProvider } from '../context/DrinkReviewContext';
import { fetchReviewsServer } from '../services/reviewServer';
import ToastProvider from '../components/ToastProvider';
import AnalyticsInit from '../components/AnalyticsInit';

type LocaleType = 'en-GB' | 'zh-TW';
const supportedLocales = ['en-GB', 'zh-TW'] as const;
const defaultLocale = 'en-GB';

const metaContentMap = {
  'en-GB': {
    title: "Star Drink - Rate and Discover Your Favourite Drinks",
    description: "Record and rate every drink, from sugar and ice levels to toppings. Explore community reviews and find your favourite beverages.",
    keywords: "drinks, bubble tea, milk tea, rating, reviews, sugar level, ice level, toppings, Star Drink",
    ogImage: "/screenshot.png",
  },
  'zh-TW': {
    title: "Star Drink - 評分與探索你的最愛飲料",
    description: "紀錄並評分每杯飲料，從甜度、冰塊到配料。探索社群評價，找到你的最愛飲品。",
    keywords: "飲料, 珍珠奶茶, 奶茶, 評分, 評價, 甜度, 冰塊, 配料, Star Drink",
    ogImage: "/screenshot.png",
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value || defaultLocale;
  const locale: LocaleType = supportedLocales.includes(cookieLocale as LocaleType)
  ? (cookieLocale as LocaleType)
  : defaultLocale;

  const metaContent = metaContentMap[locale];

  return {
    title: metaContent.title,
    description: metaContent.description,
    keywords: metaContent.keywords,
    authors: [{ name: "Eira" }],
    icons: {
      icon: '/bubble-tea.png',
    },
    openGraph: {
      title: metaContent.title,
      description: metaContent.description,
      url: "https://star-drink.vercel.app/",
      siteName: "Star Drink",
      images: [
        {
          url: metaContent.ogImage,
          width: 1200,
          height: 630,
          alt: "Star Drink Preview",
        },
      ],
      locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
  };
};

export default async function RootLayout({children}: {children: ReactNode}) {
    const cookieStore = await cookies();
    let locale = cookieStore.get('locale')?.value?.trim();
    if (!locale) locale = 'en-GB';
    console.log('locale:', locale);

    const reviewData = await fetchReviewsServer();

    return (
        <html lang={locale}>
        <body className='bg-background text-text'>
            <ToastProvider />
            <AnalyticsInit />
            <div className='flex flex-col'>
                <Header />
                <DrinkReviewProvider initReviewData={reviewData}>
                    <main>{children}</main>
                </DrinkReviewProvider>
                <Footer/>
            </div>
        </body>
        </html>
    );
}
