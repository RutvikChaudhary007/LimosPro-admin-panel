import type { Tfilters, TPagination } from "../global/ApiResponse.type";

type TBusinessLocation = {
  latitude: number | null;
  longitude: number | null;
};

export type TAffiliate = {
  id: string;
  userId: string;
  stripeAccountId: string;
  stripeAccountStatus: string;
  createdAt: string;
  updatedAt: string;
};
export interface IAffiliate extends Partial<TAffiliate> {
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
}

export interface IEditAffiliateRes extends IAffiliate {
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

export type TAffiliateRes = {
  affiliates: IAffiliate[];
  pagination: TPagination;
  filters: Tfilters;
};
