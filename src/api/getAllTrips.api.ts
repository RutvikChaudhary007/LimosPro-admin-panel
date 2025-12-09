import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getAllTrips = async (
  tripStatus?: string,
  page?: number,
  limit?: number,
) => {
  const params: Record<string, unknown> = {};
  if (tripStatus) {
    params.tripStatus = tripStatus;
  }
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_TRIPS}`, {
      params,
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

const useFetchAllTrips = ({
  tripStatus,
  page,
  limit,
}: {
  tripStatus?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["Trips", tripStatus, page, limit],
    queryFn: () => getAllTrips(tripStatus, page, limit),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0, // no caching
  });

export default useFetchAllTrips;
