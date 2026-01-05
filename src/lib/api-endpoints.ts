import { env } from "@/utils/env";

export const USER_SERVICE_URL = env?.VITE_API_USER_SERVICE_URL;
export const ADMIN_SERVICE_URL = env?.VITE_API_ADMIN_SERVICE_URL;
export const BOOKING_SERVICE_URL = env?.VITE_API_BOOKING_SERVICE_URL;

export const API_ENDPOINTS: Record<string, any> = {
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
  REFUND_PAYMENT: `${ADMIN_SERVICE_URL}/payments/refund`,
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
  GET_STAFF_PERMISSIONS: `${ADMIN_SERVICE_URL}/staff-member/:id/permissions`,
  SYNC_STAFF_PERMISSIONS: `${ADMIN_SERVICE_URL}/staff-member/:id/permissions`,

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

  // Reports
  GET_ALL_REPORTS: `${ADMIN_SERVICE_URL}/reports`,

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
  NOTIFICATION: {
    GET_ALL: `${ADMIN_SERVICE_URL}/notifications`,
    GET_BY_ID: (id: string) => `${ADMIN_SERVICE_URL}/notification/${id}`,
    CREATE: `${ADMIN_SERVICE_URL}/notification`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/notification/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/notification/${id}`,
    MARK_AS_READ_BY_ID: (id: string) =>
      `${ADMIN_SERVICE_URL}/notification/${id}/read`,
    MARK_AS_READ_ALL: `${ADMIN_SERVICE_URL}/notifications/mark-all-read`,
    BULK_DELETE: `${ADMIN_SERVICE_URL}/notifications/bulk-delete`,
  },
  BUSINESS_PAGE_LAYOUT: {
    GET_ALL: `${ADMIN_SERVICE_URL}/pages/business-layout`,
    GET_BY_ID: (id: string) =>
      `${ADMIN_SERVICE_URL}/pages/business-layout/${id}`,
    CREATE: `${ADMIN_SERVICE_URL}/pages/business-layout`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/pages/business-layout/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/pages/business-layout/${id}`,
  },
  CONTACT_REQUEST: {
    GET_ALL: `${ADMIN_SERVICE_URL}/contact-requests`,
    GET_BY_ID: `${ADMIN_SERVICE_URL}/contact-requests/:id`,
    CREATE: `${ADMIN_SERVICE_URL}/contact-requests`,
    REPLY: (id: string) => `${ADMIN_SERVICE_URL}/contact-requests/${id}/reply`,
  },
  META_KEY_WORD: {
    GET_ALL: `${ADMIN_SERVICE_URL}/meta-keywords`,
    GET_BY_ID: `${ADMIN_SERVICE_URL}/meta-keywords/:id`,
    CREATE: `${ADMIN_SERVICE_URL}/meta-keywords`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/meta-keywords/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/meta-keywords/${id}`,
    BULK_DELETE: `${ADMIN_SERVICE_URL}/meta-keywords/bulk-delete`,
  },
  TAG: {
    GET_ALL: `${ADMIN_SERVICE_URL}/tags`,
    GET_BY_ID: `${ADMIN_SERVICE_URL}/tags/:id`,
    CREATE: `${ADMIN_SERVICE_URL}/tags`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/tags/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/tags/${id}`,
    BULK_DELETE: `${ADMIN_SERVICE_URL}/tags/bulk-delete`,
  },
  SERVICE_PAGE_CONTENT: {
    GET_ALL: `${ADMIN_SERVICE_URL}/pages/service-content`,
    GET_BY_ID: (id: string) =>
      `${ADMIN_SERVICE_URL}/pages/service-content/${id}`,
    CREATE: `${ADMIN_SERVICE_URL}/pages/service-content`,
    UPDATE: (id: string) => `${ADMIN_SERVICE_URL}/pages/service-content/${id}`,
    DELETE: (id: string) => `${ADMIN_SERVICE_URL}/pages/service-content/${id}`,
  },
  DESTINATION_PAGE_CONTENT: {
    GET_ALL: `${ADMIN_SERVICE_URL}/pages/destination-content`,
    GET_BY_ID: (id: string) =>
      `${ADMIN_SERVICE_URL}/pages/destination-content/${id}`,
    CREATE: `${ADMIN_SERVICE_URL}/pages/destination-content`,
    UPDATE: (id: string) =>
      `${ADMIN_SERVICE_URL}/pages/destination-content/${id}`,
    DELETE: (id: string) =>
      `${ADMIN_SERVICE_URL}/pages/destination-content/${id}`,
  },
};
