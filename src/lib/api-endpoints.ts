//  export const USER_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://localhost:3000/api/v1';
//  export const USER_SERVICE_URL  = 'http://localhost:3000/api/v1';
//  export const ADMIN_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL1 ||'http://localhost:3001/api/v1';
//  export const BOOKING_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL2 ||'http://localhost:3002/api/v1';

import { env } from "@/utils/env";

export const USER_SERVICE_URL = env?.VITE_API_USER_SERVICE_URL;
export const ADMIN_SERVICE_URL = env?.VITE_API_ADMIN_SERVICE_URL;
export const BOOKING_SERVICE_URL = env?.VITE_API_BOOKING_SERVICE_URL;

//  export const USER_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL ||'http://192.168.1.8:3000/api/v1';
//  export const ADMIN_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL1 ||'http://192.168.1.8:3001/api/v1';
//  export const BOOKING_SERVICE_URL  = import.meta.env.VITE_API_BASE_URL2 ||'http://192.168.1.8:3002/api/v1';

export const API_ENDPOINTS = {
  // Auth
  SIGN_UP: `${USER_SERVICE_URL}/signup`,
  LOG_IN: `${USER_SERVICE_URL}/login`,

  // Dashboard
  GET_DASHBOARD_DETAILS: `${ADMIN_SERVICE_URL}/report/dashboard`,
  // Affiliate
  GET_ALL_AFFILIATE: `${ADMIN_SERVICE_URL}/affiliates`,
  GET_AFFILIATE_BY_ID: `${ADMIN_SERVICE_URL}/affiliate/:id`,
  CREATE_AFFILIATE: `${ADMIN_SERVICE_URL}/affiliate`,
  UPDATE_AFFILIATE: `${ADMIN_SERVICE_URL}/affiliate/:id`,
  DELETE_AFFILIATE: `${ADMIN_SERVICE_URL}/affiliate/:id`,
  BULK_DELETE_AFFILIATE: `${ADMIN_SERVICE_URL}/affiliates/bulk-delete`,

  // Fleets
  GET_ALL_FLEETS: `${ADMIN_SERVICE_URL}/vehicles`,
  GET_FLEET_BY_ID: `${ADMIN_SERVICE_URL}/vehicle/:id`,
  EDIT_FLEET_BY_ID: `${ADMIN_SERVICE_URL}/vehicle/:id`,
  CREATE_FLEET: `${ADMIN_SERVICE_URL}/vehicle`,
  DELETE_FLEET: `${ADMIN_SERVICE_URL}/vehicle/:id`,
  BULK_DELETE_FLEET: `${ADMIN_SERVICE_URL}/vehicles/bulk-delete`,

  // Booking
  GET_ALL_BOOKINGS: `${BOOKING_SERVICE_URL}/bookings`,
  GET_BOOKING_BY_ID: `${BOOKING_SERVICE_URL}/booking/:id`,

  // Chauffeur
  GET_ALL_CHAUFFEUR: `${ADMIN_SERVICE_URL}/chauffeurs`,
  GET_CHAUFFEUR_BY_ID: `${ADMIN_SERVICE_URL}/chauffeur/:id`,
  CREATE_CHAFFEUR: `${ADMIN_SERVICE_URL}/chauffeur`,
  EDIT_CHAFFEUR: `${ADMIN_SERVICE_URL}/chauffeur/:id`,
  DELETE_CHAFFEUR: `${ADMIN_SERVICE_URL}/chauffeur/:id`,
  BULK_DELETE_CHAFFEUR: `${ADMIN_SERVICE_URL}/chauffeurs/bulk-delete`,

  //Users
  USER_PROFILE: `${USER_SERVICE_URL}/user/profile`,
  GET_ALL_USERS: `${ADMIN_SERVICE_URL}/users`,
  GET_USERS_BY_ID: `${ADMIN_SERVICE_URL}/user/:id`,
  UPDATE_USER_BY_ID: `${ADMIN_SERVICE_URL}/user/ban/:id`,
  DELETE_USERS: `${ADMIN_SERVICE_URL}/user/:id`,
  BULK_DELETE_USERS: `${ADMIN_SERVICE_URL}/users/bulk-delete`,

  // Accounts
  RESET_PASSWORD: `${USER_SERVICE_URL}/auth/reset-password`,

  // Trips
  GET_ALL_TRIPS: `${USER_SERVICE_URL}/trips`,
  GET_TRIP_BY_ID: `${BOOKING_SERVICE_URL}/trip/:id`,
  BULK_DELETE_TRIPS: `${BOOKING_SERVICE_URL}/trips/bulk-delete`,

  // Regions
  GET_ALL_REGIONS: `${ADMIN_SERVICE_URL}/regions`,
  CREATE_REGION: `${ADMIN_SERVICE_URL}/region`,
  GET_REGION_BY_ID: `${ADMIN_SERVICE_URL}/region/:region_id`,
  EDIT_REGION: `${ADMIN_SERVICE_URL}/region/:regionId`,
  DELETE_REGION: `${ADMIN_SERVICE_URL}/region/:regionId`,

  // Payments
  GET_ALL_PAYMENTS: `${ADMIN_SERVICE_URL}/payments`,
  GET_PAYMENT_BY_ID: `${ADMIN_SERVICE_URL}/payments/:id`,

  // Refund
  GET_ALL_REFUND: `${ADMIN_SERVICE_URL}/payments`,
  // VIEW_REFUND: `${ADMIN_SERVICE_URL}/payments`,

  // Crew member
  GET_ALL_CREW_MEMBER: `${ADMIN_SERVICE_URL}/crewMembers`,
  CREATE_CREW_MEMBER: `${ADMIN_SERVICE_URL}/crewMember`,
  EDIT_CREW_MEMBER: `${ADMIN_SERVICE_URL}/crewMember/:id`,
  DELETE_CREW_MEMBER: `${ADMIN_SERVICE_URL}/crewMember/:id`,
  BULK_DELETE_CREW_MEMBER: `${ADMIN_SERVICE_URL}/crewMembers/bulk-delete`,

  // Staff member
  GET_ALL_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-members`,
  GET_SINGLE_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-member/:id`,
  CREATE_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-member/:regionId`,
  EDIT_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-member/:id/:regionId`,
  DELETE_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-member/:id`,
  BULK_DELETE_STAFF_MEMBER: `${ADMIN_SERVICE_URL}/staff-members/bulk-delete`,

  // Testimonials
  GET_ALL_TESTIMONIALS: `${ADMIN_SERVICE_URL}/testimonials`,
  GET_TESTIMONIAL_BY_ID: `${ADMIN_SERVICE_URL}/testimonials/:id`,
  CREATE_TESTIMONIAL: `${ADMIN_SERVICE_URL}/testimonials`,
  EDIT_TESTIMONIAL: `${ADMIN_SERVICE_URL}/testimonials/:id`,
  DELETE_TESTIMONIAL: `${ADMIN_SERVICE_URL}/testimonials/:id`,
  BULK_DELETE_TESTIMONIAL: `${ADMIN_SERVICE_URL}/testimonials/bulk-delete`,

  // FAQS
  GET_ALL_FAQ: `${ADMIN_SERVICE_URL}/faqs`,
  GET_FAQ_BY_ID: `${ADMIN_SERVICE_URL}/faqs/:id`,
  CREATE_FAQ: `${ADMIN_SERVICE_URL}/faqs`,
  EDIT_FAQ: `${ADMIN_SERVICE_URL}/faqs/:id`,
  DELETE_FAQ: `${ADMIN_SERVICE_URL}/faqs/:id`,
  BULK_DELETE_FAQ: `${ADMIN_SERVICE_URL}/faqs/bulk-delete`,

  // Our Partners
  GET_ALL_PARTNERS: `${ADMIN_SERVICE_URL}/partners`,
  GET_PARTNER_BY_ID: `${ADMIN_SERVICE_URL}/partners/:id`,
  CREATE_PARTNER: `${ADMIN_SERVICE_URL}/partners`,
  EDIT_PARTNER: `${ADMIN_SERVICE_URL}/partners/:id`,
  DELETE_PARTNER: `${ADMIN_SERVICE_URL}/partners/:id`,
  BULK_DELETE_PARTNER: `${ADMIN_SERVICE_URL}/partners/bulk-delete`,

  // News
  GET_ALL_NEWS: `${ADMIN_SERVICE_URL}/news`,
  GET_NEWS_BY_ID: `${ADMIN_SERVICE_URL}/news/:id`,
  CREATE_NEWS: `${ADMIN_SERVICE_URL}/news`,
  EDIT_NEWS: `${ADMIN_SERVICE_URL}/news/:id`,
  DELETE_NEWS: `${ADMIN_SERVICE_URL}/news/:id`,
  BULK_DELETE_NEWS: `${ADMIN_SERVICE_URL}/news/bulk-delete`,

  // IPWhiteList
  GET_ALL_IP_WHITE_LIST: `${ADMIN_SERVICE_URL}/ip-whitelist`,
  GET_IP_WHITE_LIST_BY_ID: `${ADMIN_SERVICE_URL}/ip-whitelist/:id`,
  CREATE_IP_WHITE_LIST: `${ADMIN_SERVICE_URL}/ip-whitelist`,
  EDIT_IP_WHITE_LIST: `${ADMIN_SERVICE_URL}/ip-whitelist/:id`,
  DELETE_IP_WHITE_LIST: `${ADMIN_SERVICE_URL}/ip-whitelist/:id`,
  BULK_DELETE_IP_WHITE_LIST: `${ADMIN_SERVICE_URL}/ip-whitelists/bulk-delete`,

  // Content Management APIs (Admin Service)
  BLOG: {
    GET_ALL: `${ADMIN_SERVICE_URL}/blog/posts`,
    GET_BY_ID: (id: string) => `${ADMIN_SERVICE_URL}/blog/posts/${id}`,
    CREATE: `${ADMIN_SERVICE_URL}/blog/posts`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/blog/posts/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/blog/posts/${id}`,
    GET_STATS: `${ADMIN_SERVICE_URL}/blog/stats`,
  },
  MEDIA: {
    GET_ALL: `${BOOKING_SERVICE_URL}/media/media`,
    GET_BY_ID: (id: string) => `${BOOKING_SERVICE_URL}/media/media/${id}`,
    GET_BY_CATEGORY: (category: string) =>
      `${BOOKING_SERVICE_URL}/media/category/${category}`,
    UPLOAD: `${BOOKING_SERVICE_URL}/media/upload`,
    UPLOAD_MULTIPLE: `${BOOKING_SERVICE_URL}/media/upload/multiple`,
    UPDATE: (id: string) => `${BOOKING_SERVICE_URL}/media/media/${id}`,
    DELETE: (id: string) => `${BOOKING_SERVICE_URL}/media/media/${id}`,
    GET_STATS: `${BOOKING_SERVICE_URL}/media/stats`,
  },
  CONTENT_BLOCK: {
    GET_ALL: `${ADMIN_SERVICE_URL}/content/blocks`,
    GET_TABS: `${ADMIN_SERVICE_URL}/content/blocks-unique`,
    GET_BY_ID: `${ADMIN_SERVICE_URL}/content/blocks/:id`,
    CREATE: `${ADMIN_SERVICE_URL}/content/blocks`,
    UPDATE: `${ADMIN_SERVICE_URL}/content/blocks/:id`,
    DELETE: `${ADMIN_SERVICE_URL}/content/blocks/:id`,
    GET_STATS: `${ADMIN_SERVICE_URL}/content/stats`,
  },
  // Roles
  ROLES: {
    GET_ALL: `${USER_SERVICE_URL}/role/all`,
    GET_ALL_STAFF_ROLE: `${USER_SERVICE_URL}/role/staff`,
  },
  PERSMISSIONS: {
    GET_ALL: `${ADMIN_SERVICE_URL}/permissions`,
  },
  REGIONAL_ADMIN: {
    GET_ALL: `${ADMIN_SERVICE_URL}/regional-admins`,
    GET_ONE: `${ADMIN_SERVICE_URL}/regional-admins`,
    CREATE: `${ADMIN_SERVICE_URL}/regional-admin/:regionId`,
    EDIT: `${ADMIN_SERVICE_URL}/regional-admins`,
    DELETE: `${ADMIN_SERVICE_URL}/regional-admins`,
  },
  DASHBOARD: {
    GET: `${ADMIN_SERVICE_URL}/report/dashboard`,
  },
  CONTACT_REQUEST: {
    GET_ALL: `${ADMIN_SERVICE_URL}/contact-requests`,
    GET_BY_ID: `${ADMIN_SERVICE_URL}/contact-requests/:id`,
    CREATE: `${ADMIN_SERVICE_URL}/contact-requests`,
  },
};
