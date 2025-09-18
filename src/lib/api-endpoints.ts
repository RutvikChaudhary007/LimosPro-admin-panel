//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';
 export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3001/api/v1';
console.log("baseurl:",BASE_URL);
export const API_ENDPOINTS = {
  SIGN_UP: `${BASE_URL}/signup`,
  LOG_IN: `${BASE_URL}/login`,
  USER_PROFILE :`${BASE_URL}/user/profile`,
  RESET_PASSWORD:`/auth/reset-password`,
};