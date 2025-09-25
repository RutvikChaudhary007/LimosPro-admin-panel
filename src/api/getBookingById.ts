 
import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';


export const getBookingById = async (id?: string) => {
if(id) {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_BOOKING_BY_ID.replace(":id",id)}`);
    console.log("response:",response.data)
    return response?.data?.data;
} 
return null;
};

const UsefetchBookingById = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: ['bookingById', id],
    queryFn: () => getBookingById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
export default UsefetchBookingById;