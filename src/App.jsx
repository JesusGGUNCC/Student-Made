// src/App.jsx - Modified with conditional header rendering for all user types
import { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import AdminHeader from './components/AdminHeader'
import VendorHeader from './components/VendorHeader' // Import the new VendorHeader
import Footer from './components/Footer'
import WelcomeModal from './components/WelcomeModal'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider, AuthContext } from './routes/AuthContent'

// App wrapper component that can access context
function AppContent() {
  const { userRole } = useContext(AuthContext);
  const location = useLocation();
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Check if we're on a vendor page
  const isVendorPage = location.pathname.startsWith('/vendor') || 
                        location.pathname === '/vendor-profile';
  
  return (
    <div className='min-h-screen flex flex-col'>
      <WelcomeModal />
      
      {/* Conditional header rendering based on page and user role */}
      {isAdminPage && userRole === 'admin' ? (
        <AdminHeader />
      ) : isVendorPage && (userRole === 'vendor' || userRole === 'admin') ? (
        <VendorHeader />
      ) : (
        <Header />
      )}
      
      <main className='grow bg-white-100 flex flex-row justify-center'>
        <Outlet/>
      </main>
      
      <Footer/>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;