// src/common/urls.jsx - Add vendor application endpoints
const BASE_URL = import.meta.env.VITE_API_URL;

export const API_URLS = {
  productsList: `${BASE_URL}/api/product/list`,
  productDetails: `${BASE_URL}/api/product/details`,
  addProducts: `${BASE_URL}/api/product/admin/add-products`,
  deleteAllProducts: `${BASE_URL}/api/product/admin/delete-all-products`,

  signup: `${BASE_URL}/api/user/signup`,
  login: `${BASE_URL}/api/user/login`,
  forgotPassword: `${BASE_URL}/api/user/forgotPassword`,
  resetPassword: `${BASE_URL}/api/user/resetPassword`,
  validateResetToken: `${BASE_URL}/api/user/validate-reset-token`,
  checkRemembered: `${BASE_URL}/api/user/check-remembered`,
  
  // New vendor application endpoints
  vendorApplication: `${BASE_URL}/api/vendor/application`,
  vendorApplicationStatus: `${BASE_URL}/api/vendor/application/status`,
  adminVendorApplications: `${BASE_URL}/api/admin/vendor/applications`,
  adminVendorApplication: `${BASE_URL}/api/admin/vendor/application`,
};