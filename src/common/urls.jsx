// src/common/urls.jsx - Updated with all API endpoints
const BASE_URL = import.meta.env.VITE_API_URL;

export const API_URLS = {
  // Product endpoints
  productsList: `${BASE_URL}/api/product/list`,
  productDetails: `${BASE_URL}/api/product/details`,
  addProducts: `${BASE_URL}/api/product/admin/add-products`,
  deleteAllProducts: `${BASE_URL}/api/product/admin/delete-all-products`,
  productSearch: `${BASE_URL}/api/product/search`,

  // Auth endpoints
  signup: `${BASE_URL}/api/user/signup`,
  login: `${BASE_URL}/api/user/login`,
  forgotPassword: `${BASE_URL}/api/user/forgotPassword`,
  resetPassword: `${BASE_URL}/api/user/resetPassword`,
  validateResetToken: `${BASE_URL}/api/user/validate-reset-token`,
  checkRemembered: `${BASE_URL}/api/user/check-remembered`,
  
  // User profile endpoints
  userProfileAdd: `${BASE_URL}/api/userprofile/add`,
  userProfileGet: `${BASE_URL}/api/userprofile/get`,
  userProfileUpdate: `${BASE_URL}/api/userprofile/update`,
  userProfileDelete: `${BASE_URL}/api/userprofile/delete`,
  
  // Wishlist endpoints
  wishlistGet: `${BASE_URL}/api/wishlist/get`,
  wishlistAdd: `${BASE_URL}/api/wishlist/add`,
  wishlistDelete: `${BASE_URL}/api/wishlist/delete`,
  
  // Payment endpoints
  paymentCreate: `${BASE_URL}/api/payment/create`,
  paymentGet: `${BASE_URL}/api/payment/get`,
  paymentDelete: `${BASE_URL}/api/payment/delete`,
  
  // Order endpoints
  orderCreate: `${BASE_URL}/api/order/create`,
  orderGet: `${BASE_URL}/api/order/get`,
  orderCancel: `${BASE_URL}/api/order/cancel`,
  
  // Vendor application endpoints
  vendorApplication: `${BASE_URL}/api/vendor/application`,
  vendorApplicationStatus: `${BASE_URL}/api/vendor/application/status`,
  adminVendorApplications: `${BASE_URL}/api/admin/vendor/applications`,
  adminVendorApplication: `${BASE_URL}/api/admin/vendor/application`,
  
  // Vendor product management endpoints
  vendorProducts: `${BASE_URL}/api/vendor/products`,
  addProduct: `${BASE_URL}/api/vendor/product`,
  updateProduct: `${BASE_URL}/api/vendor/product`,
  deleteProduct: `${BASE_URL}/api/vendor/product`,
  bulkAddProducts: `${BASE_URL}/api/vendor/products/bulk`,
  
  // Vendor endpoints
  vendorAll: `${BASE_URL}/api/vendor/all`,
  vendorRegister: `${BASE_URL}/api/vendor/register`,
  vendorDetails: `${BASE_URL}/api/vendor`,
};