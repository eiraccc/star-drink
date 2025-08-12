import type { Metadata } from 'next'
import '../styles/index.css'
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
            <Header />
            <DrinkReviewProvider initData={reviewData}>
                <main>{children}</main>
            </DrinkReviewProvider>
            <Footer/>
        </body>
        </html>
    );
}
