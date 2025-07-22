import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './layout/Header';
import Section from './layout/Section';
import DrinkList from './page/DrinkList';
import DrinkAdd from './page/DrinkAdd';
import DrinkEdit from './page/DrinkEdit';
import DrinkDetail from './page/DrinkDetail';
import Footer from './layout/Footer';

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
            <Route path="/drink/add" element={<DrinkAdd />} />
            <Route path="/drink/:id" element={<DrinkDetail />} />
            <Route path="/drink/:id/edit" element={<DrinkEdit />} />
            <Route path="*" element={
              <section className='m-2'>
                <h2 className='my-2'>Page not found.</h2>
                <Link to="/">
                  <button className='rounded-full bg-primary text-background p-2'>Back to home</button>
                </Link>
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
