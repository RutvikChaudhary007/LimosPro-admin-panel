export type RevenueData = {
  month: string;
  revenue: number;
  commission: number;
};

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketType = "DISPUTE" | "SUPPORT_ISSUE";
export type TicketCategory = "PAYMENT" | "SERVICE" | "APP_ISSUE" | "OTHER";

export type SupportTicket = {
  id: string;
  title: string;
  type: TicketType;
  category: TicketCategory;
  status: TicketStatus;
  region: string;
  raisedBy: string;
  createdAt: string;
};

export type PartnerStat = {
  month: string;
  newSignups: number;
  totalActive: number;
};

export type ComplianceData = {
  id: string;
  chauffeurName: string;
  licenseNumber: string;
  documentType: string;
  expiryDate: string;
  status: "EXPIRED" | "EXPIRING_SOON";
};

// Mock Revenue Data (last 12 months)
export const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 12500, commission: 2500 },
  { month: "Feb", revenue: 14200, commission: 2840 },
  { month: "Mar", revenue: 11000, commission: 2200 },
  { month: "Apr", revenue: 15800, commission: 3160 },
  { month: "May", revenue: 18900, commission: 3780 },
  { month: "Jun", revenue: 21500, commission: 4300 },
  { month: "Jul", revenue: 23100, commission: 4620 },
  { month: "Aug", revenue: 20500, commission: 4100 },
  { month: "Sep", revenue: 19200, commission: 3840 },
  { month: "Oct", revenue: 24500, commission: 4900 },
  { month: "Nov", revenue: 26800, commission: 5360 },
  { month: "Dec", revenue: 31000, commission: 6200 },
];

// Mock Tickets
export const mockTickets: SupportTicket[] = [
  {
    id: "T-1001",
    title: "Payment not received for Booking #B921",
    type: "DISPUTE",
    category: "PAYMENT",
    status: "OPEN",
    region: "USA",
    raisedBy: "John Doe (Chauffeur)",
    createdAt: "2024-12-28",
  },
  {
    id: "T-1002",
    title: "App crashing on login",
    type: "SUPPORT_ISSUE",
    category: "APP_ISSUE",
    status: "IN_PROGRESS",
    region: "India",
    raisedBy: "Sarah Smith (Partner)",
    createdAt: "2024-12-29",
  },
  {
    id: "T-1003",
    title: "Customer dispute regarding late arrival",
    type: "DISPUTE",
    category: "SERVICE",
    status: "RESOLVED",
    region: "Dubai",
    raisedBy: "Luxury Transport (Partner)",
    createdAt: "2024-12-20",
  },
  {
    id: "T-1004",
    title: "Commission calculation error",
    type: "DISPUTE",
    category: "PAYMENT",
    status: "OPEN",
    region: "Dubai",
    raisedBy: "Pierre Transport",
    createdAt: "2024-12-30",
  },
  {
    id: "T-1005",
    title: "Update bank details request",
    type: "SUPPORT_ISSUE",
    category: "OTHER",
    status: "CLOSED",
    region: "USA",
    raisedBy: "Mike Ross",
    createdAt: "2024-12-15",
  },
  {
    id: "T-1006",
    title: "GPS tracking inaccurate",
    type: "SUPPORT_ISSUE",
    category: "APP_ISSUE",
    status: "OPEN",
    region: "India",
    raisedBy: "City Limos",
    createdAt: "2024-12-31",
  },
];

// Mock Partner Stats
export const mockPartnerStats: PartnerStat[] = [
  { month: "Jan", newSignups: 5, totalActive: 45 },
  { month: "Feb", newSignups: 8, totalActive: 52 },
  { month: "Mar", newSignups: 4, totalActive: 55 },
  { month: "Apr", newSignups: 10, totalActive: 63 },
  { month: "May", newSignups: 12, totalActive: 74 },
  { month: "Jun", newSignups: 7, totalActive: 80 },
];

// Mock Compliance Data
export const mockComplianceData: ComplianceData[] = [
  {
    id: "C-001",
    chauffeurName: "Michael Knight",
    licenseNumber: "LIC-8821",
    documentType: "Driving License",
    expiryDate: "2025-01-15",
    status: "EXPIRING_SOON",
  },
  {
    id: "C-002",
    chauffeurName: "Driver Dave",
    licenseNumber: "LIC-9932",
    documentType: "Insurance",
    expiryDate: "2024-12-30",
    status: "EXPIRED",
  },
  {
    id: "C-003",
    chauffeurName: "Speedy Gonzales",
    licenseNumber: "LIC-1122",
    documentType: "Vehicle Permit",
    expiryDate: "2025-01-20",
    status: "EXPIRING_SOON",
  },
];

export const mockPartnerRevenueBreakdown = {
  labels: ["Self Revenue"],
  datasets: [
    {
      label: "Revenue Source",
      data: [12500],
      backgroundColor: ["#4ade80"],
    },
  ],
};
