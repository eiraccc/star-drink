import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './layout/Header';
import Section from './layout/Section';
import DrinkList from './page/DrinkList';
import DrinkEditor from './page/DrinkEditor';
import DrinkDetail from './page/DrinkDetail';
import ShopPage from './page/admin/shop/ShopPage';
import ShopList from './page/ShopList';
import ShopDetail from './page/ShopDetail';
import Footer from './layout/Footer';
import ErrorSection from './component/ErrorSection';
import { DrinkReviewProvider } from './context/DrinkReviewContext';

function App() {

  return (
    <div className='flex flex-col'>
      <BrowserRouter>
        <Header />
        
        <DrinkReviewProvider>
          <Routes>
            <Route>
              <Route path="/" element={(
                <DrinkList />
              )} />
              <Route path="/drink/add" element={<DrinkEditor />} />
              <Route path="/drink/:drinkId" element={<DrinkDetail />} />
              <Route path="/drink/:drinkId/edit" element={<DrinkEditor />} />
              <Route path="/shop/" element={<ShopList />} />
              <Route path="/shop/:shopSlug" element={<ShopDetail />} />
              <Route path="/admin/shop" element={<ShopPage />} />
              <Route path="*" element={
                <section>
                  <ErrorSection
                    errorMsg='Uh-oh, this page took a day off!'
                    btnActionHome={true}
                  />
                </section>
              } />
            </Route>
          </Routes>
        </DrinkReviewProvider>
        
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
