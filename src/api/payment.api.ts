// @ts-nocheck

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type TArg = {
	page?: number;
	limit?: number;
	status: "refunded" | "completed" | "pending" | "failed" | "";
};
export const getAllPayments = async ({ limit, page, status }: TArg) => {
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
	// console.log("response:",response)

	return response.data.data;
};

const useFetchAllPayments = ({ page, limit, status }: TArg) =>
	useQuery({
		queryKey: ["Payments", { limit }, { page }, { status }],
		queryFn: () => getAllPayments({ limit, page, status }),
		refetchOnWindowFocus: false,
		// refetchInterval: 60000,
		retry: false,
		// keepPreviousData: true, // for pagination
	});

export default useFetchAllPayments;

export const getPaymentById = async ({ id }: { id: string }) => {
	const response = await axiosInstance.get(
		`${API_ENDPOINTS.GET_PAYMENT_BY_ID.replace(":id", id)}`,
	);
	// console.log("response:",response)

	return response.data.data;
};

export const useFetchPaymentById = ({ id }: { id: string }) =>
	useQuery({
		queryKey: ["PaymentById", { id }],
		queryFn: () => getPaymentById({ id }),
		refetchOnWindowFocus: false,
		// refetchInterval: 60000,
		retry: false,
		// keepPreviousData: true, // for pagination
	});
