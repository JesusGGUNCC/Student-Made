import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { Country, State } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../common/urls';
import { AuthContext } from '../routes/AuthContent';
import VendorApplicationStatus from '../components/VendorApplicationStatus';
import PaymentCard from '../components/PaymentCard';

function BuyerProfile() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const { isLoggedIn, user, userRole } = useContext(AuthContext);
  const [deliveryOption, setDeliveryOption] = useState('shipping');
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
  
  // Add saved delivery info state
  const [savedDeliveryInfo, setSavedDeliveryInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Add state for managing payment cards
  const [paymentCards, setPaymentCards] = useState([]);
  const [defaultCardIndex, setDefaultCardIndex] = useState(0);
  
  // Add state for user details
  const [userDetails, setUserDetails] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // Add tabs for different profile sections
  const [activeTab, setActiveTab] = useState('personal');
  
  // 添加国家和州的状态
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US'); // 默认选择美国

  // 添加表单状态
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    zipCode: '',
    city: '',
    state: '',
    phoneNumber: '',
    country: 'US'
  });

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=buyerprofile');
    } else {
      // Fetch user details
      fetchUserDetails();
    }
  }, [isLoggedIn, navigate]);

  // 添加错误状态
  const [errors, setErrors] = useState({});

  // Fetch user details
  const fetchUserDetails = async () => {
    if (!user) return;
    
    try {
      setIsLoadingUser(true);
      // Fetch user profile from backend
      const response = await axios.get(`${API_URLS.userProfileGet}?username=${user.username}`);
      
      if (response.data) {
        // Update user details state
        setUserDetails(response.data);
        
        // Update form data with user details
        setFormData({
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          address1: response.data.address1 || '',
          address2: response.data.address2 || '',
          zipCode: response.data.zip_code || '',
          city: response.data.city || '',
          state: response.data.state || '',
          phoneNumber: response.data.phone_number || '',
          country: response.data.country || 'US'
        });
        
        // Set saved delivery info
        setSavedDeliveryInfo({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          address1: response.data.address1,
          address2: response.data.address2,
          zipCode: response.data.zip_code,
          city: response.data.city,
          state: response.data.state,
          phoneNumber: response.data.phone_number,
          country: response.data.country
        });
        
        // Update selected country and states
        if (response.data.country) {
          setSelectedCountry(response.data.country);
          const countryStates = State.getStatesOfCountry(response.data.country);
          setStates(countryStates);
        }
      }
      
      // Fetch payment methods
      // This would be a separate API call in a real application
      // For now, we'll just use a mock
      setPaymentCards([
        {
          cardNumber: '4111111111111111',
          expirationDate: '12/25',
          nameOnCard: user.username
        }
      ]);
      
      setNewEmail(user.email || '');
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // 修改表单验证逻辑
  const validateForm = (fieldsToValidate = null) => {
    const newErrors = {};
    
    // 更新必填字段列表
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      address1: 'Address',
      zipCode: 'ZIP Code',
      city: 'City',
      state: 'State',
      phoneNumber: 'Phone Number'
    };

    // Only validate specified fields or all if not specified
    const fieldsToCheck = fieldsToValidate === 'delivery' 
      ? ['firstName', 'lastName', 'address1', 'zipCode', 'city', 'state', 'phoneNumber', 'country']
      : Object.keys(requiredFields);
    
    // 检查必填字段
    fieldsToCheck.forEach(field => {
      if (requiredFields[field] && !formData[field]?.trim()) {
        newErrors[field] = `${requiredFields[field]} is required`;
      }
    });

    // 特殊验证逻辑
    if (fieldsToCheck.includes('phoneNumber') && formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // 检查国家选择
    if (fieldsToCheck.includes('country') && !selectedCountry) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle saving email
  const handleSaveEmail = async () => {
    if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // In a real application, you would send an API request to update the email
      console.log('Updating email to:', newEmail);
      
      // Simulate successful update
      setTimeout(() => {
        // Update user context
        if (user) {
          user.email = newEmail;
        }
        
        setIsSaving(false);
        setIsEditingEmail(false);
        setEmailError('');
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }, 1000);
    } catch (err) {
      console.error('Error updating email:', err);
      setEmailError('Failed to update email. Please try again.');
      setIsSaving(false);
    }
  };

  // 修改支付处理逻辑
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = () => {
    setIsSubmitting(true);
    const isValid = validateForm();
    
    if (isValid && paymentCards.length > 0) {
      // 模拟支付成功
      setTimeout(() => {
        alert('Payment successful!');
        setCartItems([]); // 清空购物车
        navigate('/'); // 返回首页
      }, 1000);
    } else if (paymentCards.length === 0) {
      alert('Please add at least one payment card.');
      setIsSubmitting(false);
    } else {
      alert('Please fill in all required fields correctly.');
      setIsSubmitting(false); // 重置提交状态，允许再次点击
    }
  };

  // Handle saving delivery information
  const handleSaveDeliveryInfo = async () => {
    // Validate only delivery-related fields
    const isValid = validateForm('delivery');
    
    if (isValid) {
      setIsSaving(true);
      
      // Extract delivery information from form data
      const deliveryInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        zipCode: formData.zipCode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phoneNumber: formData.phoneNumber
      };
      
      try {
        // In a real app, you would update the user profile in the backend
        const profileData = {
          username: user.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          address1: formData.address1,
          address2: formData.address2 || '',
          country: formData.country,
          zip_code: formData.zipCode,
          city: formData.city,
          state: formData.state,
          phone_number: formData.phoneNumber
        };
        
        // Check if profile exists
        if (userDetails) {
          // Update existing profile
          await axios.put(API_URLS.userProfileUpdate, profileData);
        } else {
          // Create new profile
          await axios.post(API_URLS.userProfileAdd, profileData);
        }
        
        setSavedDeliveryInfo(deliveryInfo);
        setSaveSuccess(true);
        
        // Refresh user details
        fetchUserDetails();
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error saving profile:', err);
        alert('Failed to save profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Load saved delivery info
  const loadSavedDeliveryInfo = () => {
    if (savedDeliveryInfo) {
      setFormData(prev => ({
        ...prev,
        ...savedDeliveryInfo
      }));
      
      // If country is changed, update states
      if (savedDeliveryInfo.country !== selectedCountry) {
        setSelectedCountry(savedDeliveryInfo.country);
        const countryStates = State.getStatesOfCountry(savedDeliveryInfo.country);
        setStates(countryStates);
      }
    }
  };

  // Handle new card save
  const handleSaveCard = (cardData) => {
    // If it's the first card, set it as default
    const isDefault = paymentCards.length === 0;
    setPaymentCards([...paymentCards, cardData]);
    
    if (isDefault) {
      setDefaultCardIndex(0);
    }
  };

  // Handle card update
  const handleUpdateCard = (index, cardData) => {
    const updatedCards = [...paymentCards];
    updatedCards[index] = cardData;
    setPaymentCards(updatedCards);
  };

  // Handle card deletion
  const handleDeleteCard = (index) => {
    const updatedCards = [...paymentCards];
    updatedCards.splice(index, 1);
    setPaymentCards(updatedCards);
    
    // Update default card index if needed
    if (index === defaultCardIndex) {
      setDefaultCardIndex(updatedCards.length > 0 ? 0 : -1);
    } else if (index < defaultCardIndex) {
      setDefaultCardIndex(defaultCardIndex - 1);
    }
  };

  // Set default card
  const handleSetDefaultCard = (index) => {
    setDefaultCardIndex(index);
  };

  // Add new card
  const handleAddNewCard = () => {
    // Add an empty card at the end that will be in edit mode
    setPaymentCards([...paymentCards, {}]);
  };

  // 在表单输入变化时重置提交状态
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setIsSubmitting(false); // 重置提交状态
  };

  // 初始化国家列表
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    
    // 初始化美国的州列表
    const countryStates = State.getStatesOfCountry('US');
    setStates(countryStates);
    
    // 设置默认国家到 formData
    setFormData(prev => ({
      ...prev,
      country: 'US'
    }));
  }, []);

  // 当国家改变时更新州列表
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
    
    // 更新 formData 中的 country
    setFormData(prev => ({
      ...prev,
      country: countryCode
    }));
    
    // 清除 country 相关的错误
    if (errors.country) {
      setErrors(prev => ({
        ...prev,
        country: ''
      }));
    }
  };

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-3 text-lg text-gray-700">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {user ? `${user.username}'s Profile` : 'My Profile'}
      </h1>
      <p className="text-gray-600 mb-6">Manage your account and preferences</p>

      {/* Show vendor application status for customers */}
      {userRole !== 'vendor' && <VendorApplicationStatus />}

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'personal' ? 'border-b-2 border-green-700 text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'addresses' ? 'border-b-2 border-green-700 text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'payment' ? 'border-b-2 border-green-700 text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Methods
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-green-700 text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
      </div>

      {/* Personal Details Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-800">
                {user ? user.username : 'Not available'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditingEmail ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 ${emailError ? 'border-red-500' : ''}`}
                  />
                  {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEmail}
                      disabled={isSaving}
                      className={`px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        setEmailError('');
                        // Reset to original email
                        if (user) {
                          setNewEmail(user.email || '');
                        }
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-800">
                    {user ? user.email : 'Not available'}
                  </div>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-green-700 hover:text-green-900 text-sm"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            
            {saveSuccess && (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your profile has been updated successfully!
              </div>
            )}
            
            <div className="pt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Account Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  View My Orders
                </button>
                
                {userRole === 'vendor' && (
                  <button
                    onClick={() => navigate('/vendor-profile')}
                    className="px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-50"
                  >
                    Go to Vendor Dashboard
                  </button>
                )}
                
                {userRole !== 'vendor' && (
                  <button
                    onClick={() => navigate('/becomevendor')}
                    className="px-4 py-2 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50"
                  >
                    Apply to Become a Vendor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Addresses</h2>
            
            {/* Show load button if there's saved info */}
            {savedDeliveryInfo && (
              <button
                onClick={loadSavedDeliveryInfo}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Load Saved Address
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <form className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FIRST NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LAST NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ADDRESS 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded mb-2 ${errors.address1 ? 'border-red-500' : ''}`}
                  placeholder="Address 1"
                />
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ADDRESS 2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Address 2"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COUNTRY <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="country"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : ''}`}
                  >
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP CODE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.zipCode ? 'border-red-500' : ''}`}
                    placeholder="ZIP Code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                  )}
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CITY <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    STATE <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PHONE NUMBER <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="Phone Number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                )}
              </div>
              
              {/* Save Button */}
              <div className="flex items-center mt-6">
                <button
                  onClick={handleSaveDeliveryInfo}
                  disabled={isSaving}
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save Address"}
                </button>
                
                {/* Success message */}
                {saveSuccess && (
                  <span className="ml-3 text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Address saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
                
      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">Transactions are secure and encrypted.</p>

          {/* Display existing cards */}
          <div className="space-y-4">
            {paymentCards.map((card, index) => (
              <PaymentCard
                key={index}
                index={index + 1}
                initialData={card}
                isDefault={index === defaultCardIndex}
                onSave={(data) => handleUpdateCard(index, data)}
                onDelete={() => handleDeleteCard(index)}
                onSetDefault={() => handleSetDefaultCard(index)}
              />
            ))}
          </div>

          {/* Add New Card Button */}
          <div className="mt-6">
            <button
              onClick={handleAddNewCard}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Payment Card
            </button>
          </div>
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Order History</h2>
          
          <div className="text-center py-4">
            <button
              onClick={() => navigate('/my-orders')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View All Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerProfile;