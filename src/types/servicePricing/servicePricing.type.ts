export type TRegion = {
  id: string;
  regionName: string;
};

export type TVehicle = {
  id: string;
  vehicleType: string;
  brand?: string;
  model?: string;
};

export type TServicePricingMetadata = {
  peakHours?: string;
  surgeMultiplier?: number;
  minimumDistance?: number;
  [key: string]: any;
};

export type TServicePricingData = {
  id?: string;
  regionId: string;
  country: string;
  city: string;
  serviceType: string;
  vehicleId: string;
  ratePerHour: number;
  minHours: number;
  extraTime: number;
  basePrice: number;
  minimumFare: number;
  cityToCityHourlyRate: number;
  pricePerMile: number;
  pricePerMinute: number;
  zonePricingEnabled: boolean;
  rateValidFrom: string;
  rateValidTo: string;
  status: string;
  pricingLevel: string;
  description: string;
  metadata?: TServicePricingMetadata;
  region?: TRegion;
  vehicle?: TVehicle;
};

export interface IServicePricingFormProps {
  initialData?: TServicePricingData;
  isVehicleFetching?: boolean;
  isRegionFetching?: boolean;
  vehicleData?: { vehicles: TVehicle[] };
  RegionData?: { regions: TRegion[] };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  disabledFields?: string[];
  type: string;
}
