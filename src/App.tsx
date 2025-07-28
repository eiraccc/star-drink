import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './layout/Header';
import Section from './layout/Section';
import DrinkList from './page/DrinkList';
import DrinkEditor from './page/DrinkEditor';
import DrinkDetail from './page/DrinkDetail';
import Footer from './layout/Footer';
import ErrorSection from './component/ErrorSection';

function App() {

  return (
    <div className='flex flex-col'>
      <BrowserRouter>
        <Header />
        
        <Routes>
          <Route>
            <Route path="/" element={(
              <DrinkList />
            )} />
            <Route path="/drink/add" element={<DrinkEditor />} />
            <Route path="/drink/:drinkId" element={<DrinkDetail />} />
            <Route path="/drink/:drinkId/edit" element={<DrinkEditor />} />
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
        
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
