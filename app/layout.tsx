import type { Metadata } from 'next'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css'
import { ToastContainer } from 'react-toastify';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { DrinkReviewProvider } from '../context/DrinkReviewContext';
import { fetchReviews } from '../services/drinkReviewsApi';
 
export const metadata: Metadata = {
  title: 'Star Drink',
  description: 'Enjoy your drinks!',
  icons: {
    icon: '/bubble-tea.png',
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
    const reviewData = await fetchReviews();
    return (
        <html lang="zh-Hant">
        <body className='bg-background text-text'>
            <ToastContainer position="top-center" autoClose={3000}/>
            <div className='flex flex-col'>
                <Header />
                <DrinkReviewProvider initData={reviewData}>
                    <main>{children}</main>
                </DrinkReviewProvider>
                <Footer/>
            </div>
        </body>
        </html>
    );
}
