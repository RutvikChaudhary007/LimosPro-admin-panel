export enum InquiryType {
  EVENT_PLANNER = "eventPlanner",
  DIPLOMATIC = "diplomatic",
}

export enum InquiryStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export type EventPlannerData = {
  companyWebsite?: string;
  city?: string;
  country?: string;
  rolePosition: string;
  eventType: string;
  estimatedGuests: string | number;
  vehicleNeeds: string[];
  eventLocation: string;
  eventDate: string;
  message?: string;
};

export type DiplomaticInquiryData = {
  countryRepresented: string;
  officeAddress: string;
  city: string;
  country: string;
  titlePosition: string;
  serviceType: string[];
  securityRequirements: string;
  primaryCitiesNeeded: string;
  specialProtocolRequirements?: string;
};

export type TInquiry = {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  details: EventPlannerData | DiplomaticInquiryData;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
