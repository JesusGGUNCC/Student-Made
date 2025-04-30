// src/routes/CustomerLogin.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "./AuthContent";
import { API_URLS } from "../common/urls";
import { useCart } from "../context/CartContext";


function CustomerLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const { setCartItems } = useCart();

  // Get redirect path from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URLS.login, {
        username: usernameOrEmail,
        password,
        remember_me: rememberMe,
        role: "customer" // Specify customer role
      });
      
      if (response.data.message === "Login Successful") {
        login(usernameOrEmail, "customer");
        setSuccessMessage("Login Successful!...")

        if (rememberMe) {
          localStorage.setItem("rememberUser", usernameOrEmail);
        } else {
          localStorage.removeItem("rememberUser");
        }
        
        // Check for pending cart in localStorage
        const pendingCart = localStorage.getItem('pendingCart');
        if (pendingCart) {
          setCartItems(JSON.parse(pendingCart));
          localStorage.removeItem('pendingCart');
        }

         setTimeout(() => {
           navigate('/');
        }, 1500);
    }
      
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-xl font-semibold text-green-900">Niner Mine</h1>
        </div>

        <h2 className="text-lg font-bold text-center mb-4">Customer Sign In</h2>
        <p className="text-gray-600 text-center mb-6">Please enter your details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email/Username</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter your email or username"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-700">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Remember Me 
            </label>
            <Link to="/forgotPassword" className="text-green-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={`/signup${location.search}`} className="text-green-700 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CustomerLogin;