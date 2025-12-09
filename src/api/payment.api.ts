import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Payment & Refund API Module
 * ============================================
 * All payment and refund-related API calls consolidated
 */

type PaymentArg = {
  page?: number;
  limit?: number;
  status: "refunded" | "completed" | "pending" | "failed" | "";
};

type RefundArg = { page?: number; limit: number };

// ============================================
// PAYMENT OPERATIONS
// ============================================

/**
 * Fetch all payments with optional filters
 */
export const getAllPayments = async ({ limit, page, status }: PaymentArg) => {
  const params: Record<string, unknown> = {};
  if (limit) params.limit = limit;
  if (status) params.status = status;
  if (page) {
    params.offset = page;
  }
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_ALL_PAYMENTS}`,
    { params },
  );

  return response.data.data;
};

/**
 * Hook to fetch all payments
 */
export const useFetchAllPayments = ({ page, limit, status }: PaymentArg) =>
  useQuery({
    queryKey: ["Payments", { limit }, { page }, { status }],
    queryFn: () => getAllPayments({ limit, page, status }),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch payment by ID
 */
export const getPaymentById = async ({ id }: { id: string }) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_PAYMENT_BY_ID.replace(":id", id)}`,
  );

  return response.data.data;
};

/**
 * Hook to fetch payment by ID
 */
export const useFetchPaymentById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["PaymentById", { id }],
    queryFn: () => getPaymentById({ id }),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// REFUND OPERATIONS
// ============================================

/**
 * Fetch all refunds
 */
export const getAllRefund = async ({ limit, page }: RefundArg) => {
  const params: Record<string, unknown> = {};

  if (limit) params.limit = limit;
  params.status = "refunded";
  if (page) {
    params.offset = page;
  }

  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_REFUND}`, {
    params,
  });

  return response.data.data;
};

/**
 * Hook to fetch all refunds
 */
export const useFetchAllRefund = ({ page, limit }: RefundArg) =>
  useQuery({
    queryKey: ["Refunds", { limit }, { page }],
    queryFn: () => getAllRefund({ limit, page }),
    refetchOnWindowFocus: false,
    retry: false,
  });
