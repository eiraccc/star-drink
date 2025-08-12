import { ReactNode } from 'react';
import type { Metadata } from 'next'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css'
import { ToastContainer } from 'react-toastify';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { DrinkReviewProvider } from '../context/DrinkReviewContext';
import { fetchReviewsServer } from '../services/drinkReviewServer';
import dynamic from 'next/dynamic';
const ToastProvider = dynamic(() => import('../components/ToastProvider'), { ssr: false });
 
export const metadata: Metadata = {
  title: 'Star Drink',
  description: 'Enjoy your drinks!',
  icons: {
    icon: '/bubble-tea.png',
  }
}

export default async function RootLayout({children}: {children: ReactNode}) {
    const reviewData = await fetchReviewsServer({});
    // console.log('reviewData', reviewData)
    return (
        <html lang="zh-Hant">
        <body className='bg-background text-text'>
            <ToastProvider />
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
