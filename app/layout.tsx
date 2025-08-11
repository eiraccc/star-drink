"use client";

import React from 'react';
import '../src/index.css';
import { DrinkReviewProvider } from '../src/context/DrinkReviewContext';
import Header from '../src/layout/Header';
import Footer from '../src/layout/Footer';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-Hant">
      <body className='bg-background text-text'>
        <Header />
        <DrinkReviewProvider>
            <main>{children}</main>
        </DrinkReviewProvider>
       <Footer/>
      </body>
    </html>
  );
}
