import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getAllTrips = async (tripStatus?: string, page?: number) => {
  const params: Record<string, unknown> = {};
  if (tripStatus) {
    params.tripStatus = tripStatus;
  }
  if (page) {
    params.page = page;
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
}: {
  tripStatus?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["Trips", tripStatus, page],
    queryFn: () => getAllTrips(tripStatus, page),
    refetchOnWindowFocus: false,
    retry: false,
  });

export default useFetchAllTrips;
