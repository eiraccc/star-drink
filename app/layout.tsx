"use client";

import React from 'react';
import '../src/index.css';

import { DrinkReviewProvider } from '../src/context/DrinkReviewContext';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-Hant">
      <body className='bg-background text-text'>
        <header>Header</header>
        <DrinkReviewProvider>
            <main>{children}</main>
        </DrinkReviewProvider>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
