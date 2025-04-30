// src/routes/BecomeVendor.jsx - Modified to handle username properly
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../common/urls";
import { AuthContext } from "./AuthContent";

const BecomeVendor = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState([]);
  const [password, setPassword] = useState(""); // New password field
  const [confirmPassword, setConfirmPassword] = useState(""); // New confirm password field
  const [username, setUsername] = useState(""); // Username field
  const [applicationStatus, setApplicationStatus] = useState("notSubmitted");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fill in fields from user data if logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setUsername(user.username);
      setEmail(user.email || "");
      
      // Check if the user already has a pending application
      checkApplicationStatus();
    }
  }, [isLoggedIn, user]);

  // Check if user already has a pending application
  const checkApplicationStatus = async () => {
    if (!user || !user.username) return;
    
    try {
      const response = await axios.get(`${API_URLS.vendorApplicationStatus}?username=${user.username}`);
      
      if (response.data.status !== "none") {
        setApplicationStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  // Product type options
  const productTypes = [
    "Jewelry", "Accessories", "Prints", "Technology", 
    "School Spirit", "Crochet", "Art", "Clothing", "Other"
  ];

  // Handle checkbox changes
  const handleProductTypeChange = (type) => {
    if (productType.includes(type)) {
      setProductType(productType.filter(item => item !== type));
    } else {
      setProductType([...productType, type]);
    }
  };

  // Validate username (only letters, numbers, and underscores)
  const validateUsername = (username) => {
    return /^[a-zA-Z0-9_]+$/.test(username);
  };

  // Validate email
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !description || productType.length === 0) {
      setError("Please fill out all required fields");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // If not logged in, require username and validate password
    if (!isLoggedIn) {
      if (!username) {
        setError("Username is required");
        return;
      }
      
      if (!validateUsername(username)) {
        setError("Username can only contain letters, numbers, and underscores");
        return;
      }
      
      if (!password) {
        setError("Password is required to create a vendor account");
        return;
      }
      
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create application data
      const applicationData = {
        name,
        email,
        phone,
        company_name: companyName,
        description,
        product_types: productType,
        username: isLoggedIn ? user.username : username
      };
      
      // Add password if not logged in
      if (!isLoggedIn && password) {
        applicationData.password = password;
      }
      
      // Submit the application
      const response = await axios.post(API_URLS.vendorApplication, applicationData);
      
      if (response.status === 201) {
        setApplicationStatus("pending");
        
        // Clear form
        setName("");
        setPhone("");
        setCompanyName("");
        setDescription("");
        setProductType([]);
        setPassword("");
        setConfirmPassword("");
        
        // Keep username and email if entered
        if (!isLoggedIn) {
          // setUsername("");
          // setEmail("");
        }
      }
    } catch (error) {
      console.error("Error submitting vendor application:", error);
      setError(error.response?.data?.error || "An error occurred while submitting your application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Different view based on application status
  if (applicationStatus === "pending") {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Application Pending Review</h2>
          <p className="text-yellow-700 mb-6">
            Thank you for applying to become a vendor at Niner Mine. Your application has been submitted and is currently under review.
            You'll receive an email notification once your application has been reviewed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  } else if (applicationStatus === "approved") {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Application Approved!</h2>
          <p className="text-green-700 mb-6">
            Congratulations! Your vendor application has been approved. You can now access your vendor dashboard and start listing products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/vendor-profile")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Vendor Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-green-600 text-green-700 px-6 py-2 rounded-md hover:bg-green-50 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  } else if (applicationStatus === "rejected") {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Application Not Approved</h2>
          <p className="text-red-700 mb-6">
            We're sorry, but your vendor application was not approved at this time. You may apply again with updated information
            by filling out the form below.
          </p>
          <button
            onClick={() => setApplicationStatus("notSubmitted")}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Apply Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
      <p className="text-gray-600 mb-6">Join our community of creators and start selling your products to UNC Charlotte students and staff.</p>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Your email address"
              required
              disabled={isLoggedIn} // Disable if user is logged in
            />
            <p className="text-xs text-gray-500 mt-1">Preferably your UNCC email</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business/Brand Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Your business or brand name (if applicable)"
            />
          </div>
        </div>
        
        {/* Username field - only show if user is not logged in */}
        {!isLoggedIn && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Choose a username"
                required={!isLoggedIn}
              />
              <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and underscores</p>
            </div>
          </div>
        )}
        
        {/* Password fields - only show if user is not logged in */}
        {!isLoggedIn && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Create a password for your vendor account"
                required={!isLoggedIn}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Confirm your password"
                required={!isLoggedIn}
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What types of products do you want to sell? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {productTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  checked={productType.includes(type)}
                  onChange={() => handleProductTypeChange(type)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tell us about yourself and your products <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Describe your products, skills, experience, and why you'd like to become a vendor"
            required
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full bg-green-700 text-white py-3 rounded-md font-medium hover:bg-green-800 transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BecomeVendor;