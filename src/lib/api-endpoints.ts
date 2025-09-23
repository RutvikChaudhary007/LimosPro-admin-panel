//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';
//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3000/api/v1';
//  export const BASE_URL1  = import.meta.env.VITE_API_BA2SE_URL ||'http://localhost:3001/api/v1';
//  export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3002/api/v1';
 export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://192.168.1.5:3000/api/v1';
 export const BASE_URL1  = import.meta.env.VITE_API_BA2SE_URL ||'http://192.168.1.5:3001/api/v1';
 export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL ||'http://192.168.1.5:3002/api/v1';
console.log("baseurl:",BASE_URL);
export const API_ENDPOINTS = {
  SIGN_UP: `${BASE_URL}/signup`,
  LOG_IN: `${BASE_URL}/login`,
  GET_ALL_AFFILIATE: `${BASE_URL1}/affiliates`,
  GET_AFFILIATE_BY_ID: `${BASE_URL1}/affiliate/:id`,
  CREATE_AFFILIATE: `${BASE_URL1}/affiliate`,
  UPDATE_AFFILIATE: `${BASE_URL1}/affiliate/:id`,
  DELETE_AFFILIATE: `${BASE_URL1}/affiliate/:id`,
  GET_ALL_CHAUFFEUR: `${BASE_URL1}/chauffeurs`,
  GET_CHAUFFEUR_BY_ID: `${BASE_URL1}/chauffeur/:id`,
  GET_ALL_FLEETS: `${BASE_URL1}/vehicles`,
  CREATE_CHAFFEUR: `${BASE_URL1}/chauffeur`,
  USER_PROFILE :`${BASE_URL}/user/profile`,
  RESET_PASSWORD:`/auth/reset-password`,
};