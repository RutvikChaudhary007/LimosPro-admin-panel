import type { ApiErrorResponse } from "@/types/global/ErrorResponse.type"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { login } from "@/api/auth.api"
import { createRegion, deleteRegion, editRegion } from "@/api/region.api"
import type { IEditData, RegionManageAccessResponse } from "@/types/region/region.type"
import type { ApiResponse } from "@/types/global/ApiResponse.type"
import { createRegionAdmin, deleteRegionAdmin, editRegionAdmin } from "@/api/regionAdmin.api"
import { useNavigate } from "react-router-dom"
import {
  bulkDeleteAffiliate,
  createAffiliate,
  deleteAffiliate,
  editAffiliate,
} from "@/api/affiliate.api"
import { constant } from "./constant"

// Auth
const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // You can still do things like storing localStorage, navigating, etc.
      const userData = response?.data
      const userRole = userData?.roles

      // reject unauthorized role
      if (!userRole || !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)) {
        //  return Promise.reject(new Error("Unauthorized user"));
        throw new Error("Unauthorized user")
      }

      return response // let caller decide success toast message
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      } else if (err instanceof Error) {
        throw err
      }
      throw new Error("An unexpected error occurred")
    },
  })

/**
 * #####################################
 * region
 * #####################################
 * @returns
 */

const useCreateRegionMutation = () =>
  useMutation({
    mutationFn: createRegion,
    onSuccess: (data) => {
      return data
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })

const useEditRegionMutation = () =>
  useMutation<ApiResponse<RegionManageAccessResponse>, AxiosError, { id: string; data: IEditData }>(
    {
      mutationFn: editRegion,
      onSuccess: (data) => {
        return data
      },
      onError: (err: unknown) => {
        if (err && typeof err === "object" && "isAxiosError" in err) {
          const axiosError = err as AxiosError<ApiErrorResponse>
          throw new Error(
            axiosError.response?.data?.message ||
              axiosError.response?.data?.error ||
              "An unexpected error occurred"
          )
        }
        throw new Error("An unexpected error occurred")
      },
    }
  )

const useDeleteRegionMutation = () =>
  useMutation({
    mutationFn: deleteRegion,
    onSuccess: (data) => {
      return data
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })

/**
 * #####################################
 * Region Admin
 * #####################################
 * @returns
 */

const useCreateRegionAdminMutation = () =>
  useMutation({
    mutationFn: createRegionAdmin,
    onSuccess: (data) => data,
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })

const useEditRegionAdminMutation = () =>
  useMutation({
    mutationFn: editRegionAdmin,
    onSuccess: (data) => {
      return data
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })

const useDeleteRegionAdminMutation = () =>
  useMutation({
    mutationFn: deleteRegionAdmin,
    onSuccess: (data) => {
      return data
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })

/**
 * #########################
 * Affiliate
 * #########################
 * */

const useCreateAffiliateMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createAffiliate,
    onSuccess: (response, variables) => {
      console.log(variables, response)

      // userPermissions are automatically stored in localStorage by the login API

      navigate(constant.ROUTING_URLS.AFFILIATE)
      return response
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })
}

const useEditAffiliateMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: editAffiliate,
    onSuccess: (response, variables) => {
      console.log(variables, response)

      // userPermissions are automatically stored in localStorage by the login API

      navigate(constant.ROUTING_URLS.AFFILIATE)
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        )
      }
      throw new Error("An unexpected error occurred")
    },
  })
}

const useDeleteAffiliateMutation = () =>
  useMutation({
    mutationFn: deleteAffiliate,
    onSuccess: (res) => {
      return res
      // setData((prev) =>
      //   prev.filter((row) => row.id !== response.id))
    },
    onError: (err: unknown) => {
      // normalize Axios error
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        ) // 🔹 important: throw
      }
      throw new Error("An unexpected error occurred") // 🔹 throw
    },
  })

const useBulkDeleteAffiliateMutation = () =>
  useMutation({
    mutationFn: bulkDeleteAffiliate,
    onSuccess: (res) => res,
    onError: (err: unknown) => {
      // normalize Axios error
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        ) // 🔹 important: throw
      }
      throw new Error("An unexpected error occurred") // 🔹 throw
    },
  })

export default {
  // Auth
  useLoginMutation,
  // region
  useCreateRegionMutation,
  useEditRegionMutation,
  useDeleteRegionMutation,
  // region admin
  useCreateRegionAdminMutation,
  useEditRegionAdminMutation,
  useDeleteRegionAdminMutation,
  // Affiliate
  useCreateAffiliateMutation,
  useEditAffiliateMutation,
  useDeleteAffiliateMutation,
  useBulkDeleteAffiliateMutation,
}
