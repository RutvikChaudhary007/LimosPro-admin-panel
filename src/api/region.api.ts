import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TRegion } from "@/components/regionManagement/region/RegionForm";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type TPara = { page?: number; limit?: number };
export const getAllRegions = async (data?: TPara) => {
  const params: Record<string, unknown> = {};
  if (data?.page) {
    params.page = data.page;
  }
  if (data?.limit) {
    params.limit = data.limit;
  }
  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_REGIONS}`, {
    params,
  });

  return response.data.data;
};

const useFetchAllRegions = (Data: TPara) =>
  useQuery({
    queryKey: ["Regions", { Data }],
    queryFn: () => getAllRegions(Data),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllRegions;

export const getSingleRegions = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_REGION_BY_ID.replace(":region_id", id)}`,
  );

  return response?.data?.data;
};

export const useFetchRegionById = (id: string) =>
  useQuery({
    queryKey: ["RegionById", { id }],
    queryFn: () => getSingleRegions(id),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export const createRegion = async (data: TRegion) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.CREATE_REGION}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};

export const editRegion = async ({
  id,
  data,
}: {
  id: string;
  data: TRegion;
}) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.EDIT_REGION.replace(":regionId", id)}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};

export const deleteRegion = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_REGION.replace(":regionId", id)}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};
