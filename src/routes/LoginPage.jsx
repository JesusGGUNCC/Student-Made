import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContent";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberUser = localStorage.getItem("rememberUser")
    if (rememberUser){
      setUsernameOrEmail(rememberUser)
      setRememberMe(true)
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: usernameOrEmail,
        password,
        remember_me : rememberMe
      });
      if (response.data.message === "Login Successful"){
        login(usernameOrEmail)

        if (rememberMe){
          localStorage.setItem("rememberUser", usernameOrEmail);
        } else {
          localStorage.removeItem("rememberUser")
        }
        setError("")

        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-xl font-semibold text-green-900">Niner Mine</h1>
        </div>

        <h2 className="text-lg font-bold text-center mb-4">Sign In</h2>
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
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-700">
            <label className="flex items-center">

           <input
            type = "checkbox"
            className= "mr-2"
            checked = {rememberMe}
            onChange= {(e) => setRememberMe(e.target.checked)} 
           />
            Remember Me 
            </label>
            <Link to="/forgotPassword" className="text-green-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-700 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;