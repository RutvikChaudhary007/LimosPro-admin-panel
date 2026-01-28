import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

const PARTNER_TRANSACTIONS_ENDPOINT = API_ENDPOINTS.PARTNER_TRANSACTIONS;

export const getPartnerTransactions = async (page = 1, limit = 10) => {
  const params = { page, limit };
  const response = await axiosInstance.get(PARTNER_TRANSACTIONS_ENDPOINT, {
    params,
  });
  return response?.data?.data || { wallets: [], pagination: undefined };
};

export const manualPartnerPayout = async (payload: {
  partnerId: string;
  amount?: number | string;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PARTNER_MANUAL_PAYOUT,
    payload,
  );
  return response.data;
};

export const useFetchPartnerTransactions = ({ page = 1, limit = 10 }) =>
  useQuery({
    queryKey: ["partner-transactions", page, limit],
    queryFn: () => getPartnerTransactions(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

export const useManualPartnerPayoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: manualPartnerPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-transactions"] });
    },
  });
};
