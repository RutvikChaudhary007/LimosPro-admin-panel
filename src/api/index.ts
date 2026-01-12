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

// Affiliate Module
export * from "./affiliate.api";
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
// Notification Module
export * from "./notification.api";
// Pages & Page Layout Module
export * from "./pages/businessPageLayout.api";
// Payment & Refund Module
export * from "./payment.api";
// Region Module
export * from "./region.api";
// Region Permission Module
export * from "./regionPermission.api";
// Report Module
export * from "./report.api";
// Staff & Crew Member Module
export * from "./staff.api";
// Trip Module
export * from "./trip.api";
// User Module
export * from "./user.api";
// Permission Module
export * from "./userPermission.api";
