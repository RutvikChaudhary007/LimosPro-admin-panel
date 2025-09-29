
import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

type DateRange = {
    from?: Date;
    to?: Date
};


export const getAllBookings = async (DateRange?: DateRange, page?: number) => {
    const params: Record<string, unknown> = {};
    if (DateRange?.from || DateRange?.to) {
        params.DateRange = {
            startDate: DateRange.from ? new Date(DateRange.from).toISOString() : undefined,
            endDate: DateRange.to ? new Date(
      Date.UTC(
        DateRange.to.getUTCFullYear(),
        DateRange.to.getUTCMonth(),
        DateRange.to.getUTCDate(),
        23, 59, 59, 999
      )
    ) : undefined,
            // endDate: DateRange.to ? new Date(DateRange.to.setHours(23, 59, 59, 999)).toISOString() : undefined,
        };
    }

    if(page){
        params.page=page;
    }
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_BOOKINGS}`, { params });
    //   console.log("response:", response?.data)
    return response?.data?.data;
};

const UsefetchAllBookings = ({ DateRange, page }: { DateRange?: { from: Date | undefined; to: Date | undefined }, page?: number }) =>
    useQuery({
        queryKey: ['Bookings', DateRange, page],
        queryFn: () => getAllBookings(DateRange, page),
        refetchOnWindowFocus: false,
        retry: false,
    });
export default UsefetchAllBookings;