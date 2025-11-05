import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from "@/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined }

export const getAllAffiliate = async (DateRange?: DateRange, page?: number) => {
  const params: Record<string, unknown> = {}
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate ? new Date(DateRange.startDate).toISOString() : undefined,
      endDate: DateRange.endDate ? new Date(DateRange.endDate).toISOString() : undefined,
    }
  }

  if (page) {
    params.page = page
  }

  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_AFFILIATE}`, { params })
    console.log("response:", response.data)
    return response?.data?.data
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      // Treat 400 as "no data" instead of an actual error
      return []
    }
    throw error
  }
}

const useFetchAllAffiliate = ({
  DateRange,
  page,
}: {
  DateRange?: { startDate: Date | undefined; endDate: Date | undefined }
  page?: number
}) =>
  useQuery({
    queryKey: ["affiliates", DateRange, page],
    queryFn: () => getAllAffiliate(DateRange, page),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    select: (data) => {
      console.log("data...", data)
      return data
    },
  })

export default useFetchAllAffiliate
export const getAffiliateById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_AFFILIATE_BY_ID.replace(":id", id)}`
  )
  console.log("response:", response.data)
  return response?.data?.data
}

export const useFetchAffiliateById = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["affiliateById", id],
    queryFn: () =>
      id
        ? getAffiliateById(id)
        : () => {
            console.log("id missing")
          },
    refetchOnWindowFocus: false,
    retry: false,
  })

export const createAffiliate = async (data: object) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_AFFILIATE, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const editAffiliate = async ({ data, id }: { data: object; id: string | undefined }) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_AFFILIATE.replace(":id", id as string),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}
export const deleteAffiliate = async (id: string) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_AFFILIATE.replace(":id", id))

  return response.data
}

export const bulkDeleteAffiliate = async (ids: string[]) => {
  const data = {
    affiliateIds: ids,
  }
  const response = await axiosInstance.post(API_ENDPOINTS.BULK_DELETE_AFFILIATE, data)

  return response.data
}
