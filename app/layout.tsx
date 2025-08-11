import React from 'react';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-Hant">
      <body>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
