import { ReactNode } from 'react';
import type { Metadata } from 'next'
import { cookies } from 'next/headers';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Sidebar from '../layout/Sidebar';
import ToastProvider from '../components/ToastProvider';
import AnalyticsInit from '../components/AnalyticsInit';
import Providers from './providers';
import { AuthProvider } from '../context/AuthContext';

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

    return (
        <html lang={locale}>
        <body className='bg-background text-text'>
          <ToastProvider />
          <AnalyticsInit />
          
          <Providers>
            <AuthProvider>
              <div className='flex w-full'>
                <div className='hidden sm:block w-[50px] fixed top-2 bottom-2 left-2 z-30'>
                  <Sidebar />
                </div>
                <div className='sm:pl-[60px] flex-1 flex flex-col'>
                    <div className="block sm:hidden">
                      <Header />
                    </div>
                    <main>{children}</main>
                    <Footer/>
                </div>
              </div>
            </AuthProvider>
          </Providers>
        </body>
        </html>
    );
}
