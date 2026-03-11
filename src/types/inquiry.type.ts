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
  eventType:
    | "Corporate Event"
    | "Conference"
    | "Wedding"
    | "Sports Event"
    | "Festival";
  estimatedGuests: number;
  vehicleNeeds: {
    sedans?: number;
    suvs?: number;
    vans?: number;
    minibuses?: number;
    motorCoaches?: number;
  };
  eventLocation: {
    city: string;
    venue?: string;
  };
  eventDate: string;
  message?: string;
};

export type DiplomaticInquiryData = {
  countryRepresented: string;
  officeAddress: string;
  city: string;
  country: string;
  titlePosition: string;
  serviceType:
    | "Airport Transfers"
    | "Hourly Chauffeur"
    | "Diplomatic Delegation Transport"
    | "VIP Transportation";
  securityRequirements: (
    | "Standard Chauffeur"
    | "Enhanced Security Chauffeur"
    | "Police Escort"
  )[];
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
