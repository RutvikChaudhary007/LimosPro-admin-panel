import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface IVehicleType {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const getVehicleTypes = async (onlyActive = false) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.GET_ALL_VEHICLE_TYPES,
    {
      params: {
        limit: 200,
        onlyActive,
      },
    },
  );
  return response.data.data;
};

export const useFetchVehicleTypes = (onlyActive = false) =>
  useQuery({
    queryKey: queryKeys.vehicleType.listParams(onlyActive),
    queryFn: () => getVehicleTypes(onlyActive),
    refetchOnWindowFocus: false,
  });

export const createVehicleType = async (data: {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_VEHICLE_TYPE,
    data,
  );
  return response.data;
};

export const editVehicleType = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<
    Pick<IVehicleType, "name" | "description" | "isActive" | "sortOrder">
  >;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.EDIT_VEHICLE_TYPE.replace(":id", id),
    data,
  );
  return response.data;
};

export const deleteVehicleType = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_VEHICLE_TYPE.replace(":id", id),
  );
  return response.data;
};

export const bulkDeleteVehicleTypes = async (vehicleTypeIds: string[]) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_VEHICLE_TYPE,
    {
      vehicleTypeIds,
    },
  );
  return response.data;
};
