/**
 * ============================================
 * API Modules Index
 * ============================================
 * Central export point for all feature-based API modules
 *
 * Usage:
 * import { getChauffeurs, createChauffeur } from '@/api'
 * import * as chauffeurAPI from '@/api/chauffeur.api'
 */

// Account Module
export * from "./account.api";
// Audit Logs Module
export * from "./auditLogs.api";
// Auth Module (Login, Permissions, Roles, Dashboard)
export * from "./auth.api";
// Booking Module
export * from "./booking.api";
// Chauffeur Module
export * from "./chauffeur.api";
// CMS Module (FAQ, News, Testimonials, Partners, Tags, Meta Keywords)
export * from "./cms.api";
// Contact Module (Contact Requests, IP Whitelist)
export * from "./contact.api";
// Content Module (Blog, Media, Content Blocks)
export * from "./content.api";
// Fleet Module
export * from "./fleet.api";
// Global Search Module
export * from "./globalSearch.api";
// Notification Module
export * from "./notification.api";
// Pages & Page Layout Module
export * from "./pages/businessPageLayout.api";
export * from "./pages/citiesHubPage.api";
export * from "./pages/cityDiplomatsHubPage.api";
// Route Details Module
export * from "./pages/routeDetailPage.api";
// Partner Module
export * from "./partner.api";
// Partner Transactions Module
export * from "./partnerTransactions.api";
// Payment & Refund Module
export * from "./payment.api";
// Region Module
export * from "./region.api";
// Region Permission Module
export * from "./regionPermission.api";
// Report Module
export * from "./report.api";
// Service Pricing Module
export * from "./servicePricing.api";
// Staff & Crew Member Module
export * from "./staff.api";
// Support Tickets Module
export * from "./supportTickets.api";
// Trip Module
export * from "./trip.api";
// User Module
export * from "./user.api";
// Permission Module
export * from "./userPermission.api";
export * from "./vehicleType.api";
