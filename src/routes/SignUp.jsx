import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_URLS } from "../common/urls";



const SignUp = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate()

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("")//Clearing previous error
        setPasswordError("")//clearing password errors
        setSuccessMessage("")//clearing success message 

        if (!validateEmail(email)){
          setError("Please enter a valid email address!")
          return;
        }

        if (password !== confirmPassword){
          setPasswordError("Password do not match");
          return;
        }

        try{
            const response = await axios.post(API_URLS.signup,{
                username, email, password
            });
            if (response.data.message === "Signup Successful"){
              setSuccessMessage("Signup Sucessful!")
              //alert("Signup Successful")
              //clearing the form after signup 
              setUsername("")
              setEmail("")
              setPassword("")
              setConfirmPassword("")

              setTimeout(() => {
                navigate('/login');

              }, 2000);
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

        <h2 className="text-lg font-bold text-center mb-4">Create Account</h2>
        <p className="text-gray-600 text-center mb-4">Please enter your details</p>

        <form onSubmit = {handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Enter your email"
            />
          </div>

          <div className = "relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="Create a password"
            />
            <button
            type = "button"
            className = "absolute right-3 top-8 text-gray-500"
            onClick = {() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className = "relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="Confirm your password"
            />
            <button
            type = "button"
            className = "absolute right-3 top-8 text-gray-500"
            onClick = {() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {successMessage && (
            <p className = "text-green-500 text-sm">{successMessage}</p>
          )}


          {error && <p className = "text-red-500 text-sm">{error}</p>}
          {passwordError && <p className = "text-red-500 text-sm"> {passwordError}</p>}

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
          >
            Sign up
          </button>

          <p className ="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className = "text-green-700 hover:underline">
                Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
