
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

type TArg = {page?: number, limit: number, };
export const getAllRefund = async ({limit, page,}:TArg) => {
  const params: Record<string, unknown> = {};
  
  if(limit) params.limit = limit;
   params.status = "refunded";
  if(page){
    params.offset = page
  }

    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_REFUND}`,{params});
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchAllRefund = ({page, limit}:TArg) =>
  useQuery({
    queryKey: ['Refunds', {limit}, {page}],
    queryFn: () => getAllRefund({limit, page}),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllRefund;