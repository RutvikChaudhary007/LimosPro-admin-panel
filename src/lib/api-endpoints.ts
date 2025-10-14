//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3000/api/v1';
//  export const BASE_URL  = 'http://localhost:3000/api/v1';
//  export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'http://localhost:3001/api/v1';
//  export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'http://localhost:3002/api/v1';

 export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'https://apilimo.qalbit.in/user-service/api/v1';
 export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'https://apilimo.qalbit.in/admin-service/api/v1';
 export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'https://apilimo.qalbit.in/booking-service/api/v1';

//  export const BASE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://192.168.1.8:3000/api/v1';
//  export const BASE_URL1  = import.meta.env.VITE_API_BASE_URL1 ||'http://192.168.1.8:3001/api/v1';
//  export const BASE_URL2  = import.meta.env.VITE_API_BASE_URL2 ||'http://192.168.1.8:3002/api/v1';


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
  BULK_DELETE_AFFILIATE: `${BASE_URL1}/affiliates/bulk-delete`,
  
  // Fleets
  GET_ALL_FLEETS: `${BASE_URL1}/vehicles`,
  GET_FLEET_BY_ID: `${BASE_URL1}/vehicle/:id`,
  EDIT_FLEET_BY_ID: `${BASE_URL1}/vehicle/:id`,
  CREATE_FLEET: `${BASE_URL1}/vehicle`,
  DELETE_FLEET: `${BASE_URL1}/vehicle/:id`,
  BULK_DELETE_FLEET: `${BASE_URL1}/vehicles/bulk-delete`,
  
  // Booking
  GET_ALL_BOOKINGS: `${BASE_URL2}/bookings`,
  GET_BOOKING_BY_ID: `${BASE_URL2}/booking/:id`,
  
  // Chauffeur
  GET_ALL_CHAUFFEUR: `${BASE_URL1}/chauffeurs`,
  GET_CHAUFFEUR_BY_ID: `${BASE_URL1}/chauffeur/:id`,
  CREATE_CHAFFEUR: `${BASE_URL1}/chauffeur`,
  EDIT_CHAFFEUR: `${BASE_URL1}/chauffeur/:id`,
  DELETE_CHAFFEUR: `${BASE_URL1}/chauffeur/:id`,
  BULK_DELETE_CHAFFEUR: `${BASE_URL1}/chauffeurs/bulk-delete`,


  //Users
  USER_PROFILE :`${BASE_URL}/user/profile`,
  GET_ALL_USERS: `${BASE_URL1}/users`,
  GET_USERS_BY_ID: `${BASE_URL1}/user/:id`,
  UPDATE_USER_BY_ID: `${BASE_URL1}/user/ban/:id`,
  DELETE_USERS: `${BASE_URL1}/user/:id`,
  BULK_DELETE_USERS: `${BASE_URL1}/users/bulk-delete`,

  // Accounts
  RESET_PASSWORD:`${BASE_URL}/auth/reset-password`,

  // Trips
  GET_ALL_TRIPS:  `${BASE_URL}/trips`,
  GET_TRIP_BY_ID:  `${BASE_URL2}/trip/:id`,
  BULK_DELETE_TRIPS:  `${BASE_URL2}/trips/bulk-delete`,

  // Regions
  GET_ALL_REGIONS: `${BASE_URL1}/regions`,

  // Payments
  GET_ALL_PAYMENTS: `${BASE_URL1}/payments`,
  GET_PAYMENT_BY_ID: `${BASE_URL1}/payments/:id`,

  // Refund
  GET_ALL_REFUND: `${BASE_URL1}/payments`,
  // VIEW_REFUND: `${BASE_URL1}/payments`,

  // Crew member 
  GET_ALL_CREW_MEMBER: `${BASE_URL1}/crewMembers`,
  CREATE_CREW_MEMBER: `${BASE_URL1}/crewMember`,
  EDIT_CREW_MEMBER: `${BASE_URL1}/crewMember/:id`,
  DELETE_CREW_MEMBER: `${BASE_URL1}/crewMember/:id`,
  BULK_DELETE_CREW_MEMBER: `${BASE_URL1}/crewMembers/bulk-delete`,

  // Staff member 
  GET_ALL_STAFF_MEMBER: `${BASE_URL1}/staff-members`,
  CREATE_STAFF_MEMBER: `${BASE_URL1}/staff-member/:regionId`,
  EDIT_STAFF_MEMBER: `${BASE_URL1}/staff-member/:id/:regionId`,
  DELETE_STAFF_MEMBER: `${BASE_URL1}/staff-member/:id`,
  BULK_DELETE_STAFF_MEMBER: `${BASE_URL1}/staff-members/bulk-delete`,
  
  // Testimonials
  GET_ALL_TESTIMONIALS: `${BASE_URL1}/testimonials`,
  GET_TESTIMONIAL_BY_ID: `${BASE_URL1}/testimonials/:id`,
  CREATE_TESTIMONIAL: `${BASE_URL1}/testimonials`,
  EDIT_TESTIMONIAL: `${BASE_URL1}/testimonials/:id`,
  DELETE_TESTIMONIAL: `${BASE_URL1}/testimonials/:id`,
  BULK_DELETE_TESTIMONIAL: `${BASE_URL1}/testimonials/bulk-delete`,

  // FAQS
  GET_ALL_FAQ: `${BASE_URL1}/faqs`,
  GET_FAQ_BY_ID: `${BASE_URL1}/faqs/:id`,
  CREATE_FAQ: `${BASE_URL1}/faqs`,
  EDIT_FAQ: `${BASE_URL1}/faqs/:id`,
  DELETE_FAQ: `${BASE_URL1}/faqs/:id`,
  BULK_DELETE_FAQ: `${BASE_URL1}/faqs/bulk-delete`,
  
  // Our Partners
  GET_ALL_PARTNERS: `${BASE_URL1}/partners`,
  GET_PARTNER_BY_ID: `${BASE_URL1}/partners/:id`,
  CREATE_PARTNER: `${BASE_URL1}/partners`,
  EDIT_PARTNER: `${BASE_URL1}/partners/:id`,
  DELETE_PARTNER: `${BASE_URL1}/partners/:id`,
  BULK_DELETE_PARTNER: `${BASE_URL1}/partners/bulk-delete`,

  // News
  GET_ALL_NEWS: `${BASE_URL1}/news`,
  GET_NEWS_BY_ID: `${BASE_URL1}/news/:id`,
  CREATE_NEWS: `${BASE_URL1}/news`,
  EDIT_NEWS: `${BASE_URL1}/news/:id`,
  DELETE_NEWS: `${BASE_URL1}/news/:id`,
  BULK_DELETE_NEWS: `${BASE_URL1}/news/bulk-delete`,

  // IPWhiteList
  GET_ALL_IP_WHITE_LIST: `${BASE_URL1}/ip-whitelist`,
  GET_IP_WHITE_LIST_BY_ID: `${BASE_URL1}/ip-whitelist/:id`,
  CREATE_IP_WHITE_LIST: `${BASE_URL1}/ip-whitelist`,
  EDIT_IP_WHITE_LIST: `${BASE_URL1}/ip-whitelist/:id`,
  DELETE_IP_WHITE_LIST: `${BASE_URL1}/ip-whitelist/:id`,
  BULK_DELETE_IP_WHITE_LIST: `${BASE_URL1}/ip-whitelists/bulk-delete`,

  // Content Management APIs (Admin Service)
  BLOG: {
    GET_ALL: `${BASE_URL1}/blog/posts`,
    GET_BY_ID: (id: string) => `${BASE_URL1}/blog/posts/${id}`,
    CREATE: `${BASE_URL1}/blog/posts`,
    UPDATE: (id: string) => `${BASE_URL1}/blog/posts/${id}`,
    DELETE: (id: string) => `${BASE_URL1}/blog/posts/${id}`,
    GET_STATS: `${BASE_URL1}/blog/stats`,
  },
    MEDIA: {
    GET_ALL: `${BASE_URL2}/media/media`,
    GET_BY_ID: (id: string) => `${BASE_URL2}/media/media/${id}`,
    GET_BY_CATEGORY: (category: string) => `${BASE_URL2}/media/category/${category}`,
    UPLOAD: `${BASE_URL2}/media/upload`,
    UPLOAD_MULTIPLE: `${BASE_URL2}/media/upload/multiple`,
    UPDATE: (id: string) => `${BASE_URL2}/media/media/${id}`,
    DELETE: (id: string) => `${BASE_URL2}/media/media/${id}`,
    GET_STATS: `${BASE_URL2}/media/stats`,
  },
  // Roles
  ROLES:{
    GET_ALL: `${BASE_URL}/role/all`,
  }
};