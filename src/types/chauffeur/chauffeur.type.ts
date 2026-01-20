import type { TChauffeurForm } from "@/components/chauffeur/ChauffeurForm";

export type TChauffeur = {
  id: string;
  userId: string;
  partnerId: string;
  status: string;
  password: string;
  taxIdNumber: string;
  licenseNumber: string;
  vehicleId: string;
  documents:
    | [
        {
          size: number;
          fileUrl: string;
          mimetype: string;
          originalName: string;
        },
        {
          size: number;
          fileUrl: string;
          mimetype: string;
          originalName: string;
        },
      ]
    | string[];
  rating: string;
  availability: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  businessAddress: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  gratuity: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    id: string;
    partnerId: string;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    vehicleType: string;
    capacity: number;
    documents: [];
    vehicleImages: [];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null | undefined;
  };
};

export interface IChauffeurFormProps {
  initialData?: TChauffeurForm;
  onSubmit: (data: TChauffeurForm) => Promise<unknown>;
  disabledFields?: string[];
  type: string;
}
