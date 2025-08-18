# ⭐️ Star Drink

Welcome to **Star Drink**, your personal and social drink journal.

Forget what you drank or how it tasted? Star Drink helps you record and rate every drink, from sugar and ice levels to toppings. Discover favorites through community reviews, search, and filters.

Built with Next.js, React, Tailwind CSS, and TypeScript for a modern, fast, and SEO-friendly experience, with server-side Firebase support for secure data management.

## 📷 Screenshot
![Star Drink Screenshot](public/screenshot.png)


> ⚠️ **Development Status:** This is version 1 (v1) and the project is under active development. Features and APIs may change.


## 🚀 Features
### Core Features
- 🔍 Filter drinks by ice level, sugar level, and toppings
- 🌟 Rate drinks using a 5-star system
- 📜 Sort reviews by rating or creation time
- 🔁 Toggle between light and dark mode
- 🔄 Real-time data sync with Firebase Firestore
- 💬 Show error messages when invalid drink ID is accessed
- 🌀 Loading overlay during create, read, update, and delete operations
- ✨ Fully responsive UI
- 🏪 Shop list showing selected drink reviews
- 📋 Shop detail page with full reviews
- ⚙️ Shop management page for adding, editing, deleting, and approving
- ✔ Shop approval system to control listing visibility
- ➕ Users can submit reviews and propose new shops
### Next.js Enhancements
- ⚡ Server-side rendering (SSR)
- 📄 Static site generation (SSG)
- 🌍 SEO-friendly metadata
- 🔒 Firebase Admin SDK for server-side logic

## 🛠️ Tech Stack

- **React** (v18)  
- **Next.js** (App Router) – SSR/SSG and API routes  
- **TypeScript**  
- **Vite** – used in the legacy SPA build  
- **Tailwind CSS** – utility-first styling  
- **React Router DOM** (v7) – used in SPA routing (legacy)  
- **React Icons** – icon set  
- **React Select** – customizable select inputs  
- **Firebase (Firestore)** – managing drink reviews and shop data  
- **Firebase Client SDK** – used in the browser (Firestore, etc.)  
- **Firebase Admin SDK** – used server-side in Next.js (secure access, serverTimestamp, etc.)  
- **Firebase serverTimestamp & Timestamp** – consistent time handling  
- **date-fns / date-fns-tz** – date formatting and timezone conversion 

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure
```bash
.
├── app/            # Next.js App Router pages
│   ├── admin/
│   │   └── shop/
│   ├── drink/
│   │   ├── [drinkId]/
│   │   │   └── edit/
│   │   └── add/
│   └── shop/
│       └── [shopSlug]/
├── components/     # Reusable UI components
├── constants/      # Constant values and configs
├── context/        # React Context providers
├── layout/         # Layout components (Header, Footer, etc.)
├── lib/            # Library helpers (Firebase, etc.)
├── public/         # Static assets
├── services/       # API client/server logic
├── styles/         # Global styles
├── types/          # TypeScript definitions
├── utils/          # Utility functions

```

## 🖼️ Attributions
The favicon used in this project was downloaded from Icons8 and is used with attribution.

## 📜 License
This project is licensed under a **[custom non-commercial license](./LICENSE)**.  
See the LICENSE file for details.
