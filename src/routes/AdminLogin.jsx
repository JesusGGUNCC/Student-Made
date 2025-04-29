// src/routes/AdminLogin.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContent";
import { API_URLS } from "../common/urls";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URLS.login, {
        username,
        password,
        role: "admin" // Specify admin role
      });
      
      if (response.data.role !== "admin") {
        setError("This account does not have admin privileges");
        setIsLoading(false);
        return;
      }

      login(username, "admin");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <div className="flex justify-center mb-4">
          <div className="bg-green-700 text-white px-4 py-2 rounded-md">
            <span className="font-bold">ADMIN</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter admin username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter password"
              required
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign in'}
          </button>
          
          <div className="border-t border-gray-300 mt-6 pt-4 text-center">
            <Link to="/admin/portal" className="text-green-700 hover:underline">
              Back to Admin Portal
            </Link>
          </div>
          
          <div className="text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              Return to Main Site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;