export type TPagination = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type Tfilters = {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
  stripeAccountStatus?: string;
  entityType?: string;
  companyName?: string;
  businessEmail?: string;
  taxId?: string;
};

export interface IApiResponse<Data extends object> {
  data: Data;
  sucess: boolean;
  message: string;
}

export type PromiseReturnType<T> = T extends Promise<infer R> ? R : T;
