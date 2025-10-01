//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3000/api/v1';
//  export const BASE_URL  = 'http://localhost:3000/api/v1';
//  export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'http://localhost:3001/api/v1';
//  export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'http://localhost:3002/api/v1';

 export const BASE_URL  = 'http://192.168.1.7:3000/api/v1';
 export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'http://192.168.1.7:3001/api/v1';
 export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'http://192.168.1.7:3002/api/v1';

//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://192.168.1.10:3000/api/v1';
//  export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'http://192.168.1.10:3001/api/v1';
//  export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'http://192.168.1.10:3002/api/v1';


export const API_ENDPOINTS = {
  // Auth
  SIGN_UP: `${BASE_URL}/signup`,
  LOG_IN: `${BASE_URL}/login`,

  // Affiliate
  GET_ALL_AFFILIATE: `${BASE_URL1}/affiliates`,
  GET_AFFILIATE_BY_ID: `${BASE_URL1}/affiliate/:id`,
  CREATE_AFFILIATE: `${BASE_URL1}/affiliate`,
  UPDATE_AFFILIATE: `${BASE_URL1}/affiliate/:id`,
  DELETE_AFFILIATE: `${BASE_URL1}/affiliate/:id`,
  
  // Fleets
  GET_ALL_FLEETS: `${BASE_URL1}/vehicles`,
  GET_FLEET_BY_ID: `${BASE_URL1}/vehicle/:id`,
  CREATE_FLEET: `${BASE_URL1}/vehicle`,
  DELETE_FLEET: `${BASE_URL1}/vehicle/:id`,
  
  // Booking
  GET_ALL_BOOKINGS: `${BASE_URL2}/bookings`,
  GET_BOOKING_BY_ID: `${BASE_URL2}/booking/:id`,
  
  // Chauffeur
  GET_ALL_CHAUFFEUR: `${BASE_URL1}/chauffeurs`,
  GET_CHAUFFEUR_BY_ID: `${BASE_URL1}/chauffeur/:id`,
  CREATE_CHAFFEUR: `${BASE_URL1}/chauffeur`,

  //Users
  USER_PROFILE :`${BASE_URL}/user/profile`,
  GET_ALL_USERS: `${BASE_URL1}/users`,
  GET_USERS_BY_ID: `${BASE_URL1}/user/:id`,
  UPDATE_USER_BY_ID: `${BASE_URL1}/user/ban/:id`,
  DELETE_USERS: `${BASE_URL1}/user/:id`,

  // Accounts
  RESET_PASSWORD:`${BASE_URL}/auth/reset-password`,

  // Trips
  GET_ALL_TRIPS:  `${BASE_URL}/trips`,
  GET_TRIP_BY_ID:  `${BASE_URL2}/trip/:id`,

  // Regions
  GET_ALL_REGIONS: `${BASE_URL1}/regions`,

  // Payments
  GET_ALL_PAYMENTS: `${BASE_URL1}/payments`,

  // Refund
  GET_ALL_REFUND: `${BASE_URL1}/payments`,
  // VIEW_REFUND: `${BASE_URL1}/payments`,

  // Crew member 
  GET_ALL_CREW_MEMBER: `${BASE_URL1}/crewMembers`,
  CREATE_CREW_MEMBER: `${BASE_URL1}/crewMember`,
  EDIT_CREW_MEMBER: `${BASE_URL1}/crewMember/:id`,
  DELETE_CREW_MEMBER: `${BASE_URL1}/crewMember/:id`,

  // Crew member 
  GET_ALL_STAFF_MEMBER: `${BASE_URL1}/staff-members`,
  CREATE_STAFF_MEMBER: `${BASE_URL1}/staff-member`,
  EDIT_STAFF_MEMBER: `${BASE_URL1}/staff-member/:id`,
  DELETE_STAFF_MEMBER: `${BASE_URL1}/staff-member/:id`,
};