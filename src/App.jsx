// src/App.jsx - Modified with conditional header rendering
import { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import AdminHeader from './components/AdminHeader' // We'll need to create this
import Footer from './components/Footer'
import WelcomeModal from './components/WelcomeModal'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider, AuthContext } from './routes/AuthContent'

// AdminHeader component definition
const AdminHeader = () => {
  return (
    <nav className='px-4 sm:px-6 md:px-10 flex justify-between items-center h-[10vh] bg-gray-800 text-white'>
      <div className='flex items-center'>
        <a href="/admin" className="text-2xl font-bold">Admin Dashboard</a>
      </div>
      <div className='flex items-center gap-4'>
        <a href="/" className="hover:text-gray-300">
          Return to Site
        </a>
        <a href="/logout" className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </a>
      </div>
    </nav>
  );
};

// App wrapper component that can access context
function AppContent() {
  const { userRole } = useContext(AuthContext);
  const location = useLocation();
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className='min-h-screen flex flex-col'>
      <WelcomeModal />
      
      {/* Conditional header rendering */}
      {isAdminPage && userRole === 'admin' ? (
        <AdminHeader />
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