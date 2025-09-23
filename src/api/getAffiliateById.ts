 
import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';


export const getAffiliateById = async (id: string) => {

  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_AFFILIATE_BY_ID.replace(":id",id)}`);
  console.log("response:",response.data)
  return response?.data?.data;
};

const UsefetchAffiliateById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ['affiliateById', id],
    queryFn: () => getAffiliateById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
export default UsefetchAffiliateById;