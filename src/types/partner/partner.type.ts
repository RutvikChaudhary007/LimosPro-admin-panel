import type { Tfilters, TPagination } from "../global/ApiResponse.type";

export enum PartnerType {
  CORPORATE = "corporate",
  HOTEL = "hotel",
  TRAVEL_AGENT = "travelAgent",
  INDIVIDUAL = "individual",
}

type TBusinessLocation = {
  latitude: number | null;
  longitude: number | null;
};

export type TPartner = {
  id: string;
  userId: string;
  stripeAccountId: string;
  stripeAccountStatus: string;
  createdAt: string;
  updatedAt: string;
};
export interface IPartner extends Partial<TPartner> {
  businessAddress: string;
  businessContactNumber: string;
  businessEmail: string;
  commissionRate: string;
  companyName: string;
  documents: File[];
  email: string;
  entityType: string;
  firstName: string;
  isChauffer: boolean;
  lastName: string;
  businessLocation: TBusinessLocation;
  password: string;
  status?: string;
  taxId: string;
  partnerType?: PartnerType;
}

export interface IEditPartnerRes extends IPartner {
  user: {
    id: string;
    createdAt: string;
    dateOfBirth: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    password: string;
    passwordLength: number;
    paymentMethod: string;
    phoneNumber: string;
    profilePicture: string;
    status: string;
    updatedAt: string;
  };
  location: TBusinessLocation;
}

export type TPartnerRes = {
  Partners: IPartner[];
  pagination: TPagination;
  filters: Tfilters;
};
