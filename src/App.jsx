// src/App.jsx - Modified
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import WelcomeModal from './components/WelcomeModal'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './routes/AuthContent'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className='min-h-screen flex flex-col'>
            <WelcomeModal />
            <Header/>

            <main className='grow bg-white-100 flex flex-row justify-center'>
              <Outlet/>
            </main>

            <Footer/>
            
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App