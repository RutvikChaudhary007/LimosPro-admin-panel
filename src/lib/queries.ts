import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deletefleet } from "@/api/deleteFleet";

// Fleet

const useDeletefleetMutation = (refetch: ()=>void)=> useMutation({
    mutationFn: deletefleet,
    onSuccess: ()=>{refetch()},
    onError: (err: unknown)=>{
      let errorMessage = 'An unexpected error occurred';
      
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
      }
      
      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      // toast({
      //   title: "Delete fleet failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    }
  });


export default {
    useDeletefleetMutation,
}