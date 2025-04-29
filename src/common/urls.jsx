const BASE_URL = import.meta.env.VITE_API_URL;

export const API_URLS = {
  productsList: `${BASE_URL}/product/list`,
  productDetails: `${BASE_URL}/product/details`,
  addProducts: `${BASE_URL}/product/admin/add-products`,
  deleteAllProducts: `${BASE_URL}/product/admin/delete-all-products`,
  signup: `${BASE_URL}/user/signup`,
  login: `${BASE_URL}/user/login`,
  forgotPassword: `${BASE_URL}/user/forgotPassword`,
  resetPassword: `${BASE_URL}/user/resetPassword`,
  validateResetToken: `${BASE_URL}/user/validate-reset-token`
};
