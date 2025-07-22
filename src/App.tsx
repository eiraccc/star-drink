import { useState, useEffect } from 'react'
import Header from './layout/header';
import Section from './layout/section';
import Footer from './layout/footer';

function App() {

  return (
    <div className='flex flex-col'>
      <Header />
      <Section />
      <Footer />
    </div>
  )
}

export default App
