import React from 'react';
import '../src/index.css';
import { DrinkReviewProvider } from '../src/context/DrinkReviewContext';
import { ShopProvider } from '../src/context/ShopContext';
import Header from '../src/layout/Header';
import Footer from '../src/layout/Footer';
import { fetchReviews } from '../services/reviews';

export default async function RootLayout({children}: {children: React.ReactNode}) {
    const reviewData = await fetchReviews();
    return (
        <html lang="zh-Hant">
        <body className='bg-background text-text'>
            <Header />
            <DrinkReviewProvider initData={reviewData}>
            <ShopProvider>
                <main>{children}</main>
            </ShopProvider>
            </DrinkReviewProvider>
        <Footer/>
        </body>
        </html>
    );
}
