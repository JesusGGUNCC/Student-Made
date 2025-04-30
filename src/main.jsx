// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import App from './App.jsx'
import Home from './routes/Home.jsx'
import Products from './routes/Products.jsx'
import Cart from './routes/Cart.jsx'
import About from './routes/About.jsx'
import CustomerLogin from './routes/CustomerLogin.jsx'
import AdminLogin from './routes/AdminLogin.jsx'
import VendorLogin from './routes/VendorLogin.jsx'
import AdminPortal from './routes/AdminPortal.jsx'
import VendorPortal from './routes/VendorPortal.jsx'
import BuyerProfile from './routes/BuyerProfile.jsx'
import VendorProfile from './routes/VendorProfile.jsx'
import WishList from './routes/Wishlist.jsx'
import Checkout from './routes/Checkout.jsx'
import SignUp from './routes/SignUp.jsx'
import ForgotPassword from './routes/ForgotPassword.jsx'
import ResetPassword from './routes/ResetPassword.jsx'
import Product from './routes/Product.jsx'
import BecomeVendor from './routes/BecomeVendor.jsx'
import AdminDashboard from './routes/AdminDashboard.jsx'
import OrderConfirmation from './routes/OrderConfirmation.jsx'
import UserOrders from './routes/UserOrders.jsx'
import VendorOrders from './routes/VendorOrders.jsx'
import OrderDetail from './routes/OrderDetail.jsx'
import SearchResults from './routes/SearchResults.jsx'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>, // Root Layout
    children: [
      { index: true, element: <Home/> },
      { path: 'shop-all', element: <Products/> },
      { path: 'cart', element: <Cart/> },
      
      // Customer login/auth routes
      { path: 'login', element: <CustomerLogin/> },
      { path: 'signup', element: <SignUp/> },
      { path: 'forgotPassword', element: <ForgotPassword/>},
      { path: 'resetPassword', element: <ResetPassword/>},
      
      // Admin routes
      { path: 'admin/portal', element: <AdminPortal/> },
      { path: 'admin/login', element: <AdminLogin/> },
      { path: 'admin', element: <AdminDashboard/>},
      
      // Vendor routes
      { path: 'vendor/portal', element: <VendorPortal/> },
      { path: 'vendor/login', element: <VendorLogin/> },
      { path: 'vendor-profile', element: <VendorProfile/> },
      { path: 'vendor/orders', element: <VendorOrders/>},
      { path: 'vendor/:vendorId', element: <VendorProfile/>},
      
      // General routes
      { path: 'about', element: <About/> },
      { path: 'buyer-profile', element: <BuyerProfile/>},
      { path: 'buyerprofile', element: <BuyerProfile/>},
      { path: 'wishlist', element: <WishList/> },
      { path: 'checkout', element: <Checkout/> },
      { path: 'product/:productId', element: <Product/> },
      { path: 'product', element: <Product/> },
      { path: 'becomevendor', element: <BecomeVendor/>},
      { path: 'order-confirmation/:orderId', element: <OrderConfirmation/>},
      { path: 'my-orders', element: <UserOrders/>},
      { path: 'order/:orderId', element: <OrderDetail/>},
      { path: 'search', element: <SearchResults/>},
    ],  
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)