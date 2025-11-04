import type { ApiErrorResponse } from "@/types/global/ErrorResponse.type"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { login } from "@/api/auth.api"

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

export default {
  // Auth
  useLoginMutation,
}
