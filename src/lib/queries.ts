import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import { useMutation, type RefetchOptions, type QueryObserverResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deletefleet } from "@/api/deleteFleet";
import { deleteAffiliate } from "@/api/deleteAffiliate";
import { login } from "@/api/login";
import { useNavigate } from "react-router-dom";
import { constant } from "./constant";
import { deleteUser } from "@/api/deleteUser";
import { createChauffeur } from "@/api/createChauffeur";
import type { IUserFormData } from "@/types/user";
import { updateUser } from "@/api/updateUserById";
import { createAffiliate } from "@/api/createAffiliate";


type TRefetch= (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<unknown, Error>>

// Auth
const useLoginMutation = ()=> {
  const navigate = useNavigate()
  return useMutation({
  mutationFn: login,
  // onSuccess: (response, variables) => {
  //   console.log('Login response:', response);
    
  //   const userData = response?.data;
  //   const userRole = userData?.roles;
  //   const remember = localStorage.getItem("remember");
  //   if(remember === "true"){
  //     localStorage.setItem("Email", userData?.email);
  //   }
  //   // userPermissions are automatically stored in localStorage by the login API
    
  //   // Check if user has valid role for admin panel
  //   if (!userRole || !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)) {
      
  //     toast({
  //       title: "Access Denied",
  //       description: "This section is for authorized users only. Please contact your administrator.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // Success message
  //   const staySignedInMessage = variables.remember ? 'You will stay signed in' : 'You will be logged out after session expires';
  //   toast({
  //     title: "Login Successful",
  //     description: `Welcome back! ${staySignedInMessage}`,
  //     variant: "default",
  //   });

  //   // Navigate to dashboard
  //   navigate(constant.ROUTING_URLS.DASHBOARD);
  // },
  onSuccess: (response, variables: {email: string, password: string,remember: boolean | undefined}) => {
    
    // You can still do things like storing localStorage, navigating, etc.
    const userData = response?.data;
    const userRole = userData?.roles;

    if (variables?.remember) {
      localStorage.setItem("remember", "true");
    } else {
      localStorage.removeItem("remember");
    }

    // reject unauthorized role
    if (!userRole || !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)) {
      throw new Error("Unauthorized user");
    }

    navigate(constant.ROUTING_URLS.DASHBOARD);

    return response; // let caller decide success toast message
  },
  onError: (err: unknown) => {
    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  
    // let errorMessage = 'An unexpected error occurred';
    
    // if (err && typeof err === 'object' && 'isAxiosError' in err) {
    //   const axiosError = err as AxiosError<ApiErrorResponse>;
    //   errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
    // }
    
    // // Don't show toast for rate limiting
    // if (errorMessage.includes("429")) return;
    // return errorMessage
    // toast({
    //   title: "Login Failed",
    //   description: errorMessage,
    //   variant: "destructive",
    // });
  }
});
}

/**
 * ##########################################
 * Fleet 
 * ##########################################
 * @param refetch 
 * @returns 
 */ 


const useDeletefleetMutation = (refetch: TRefetch)=> useMutation({
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


  /**
   * ######################### 
   * Affiliate
   * #########################
   * */

  const useCreateAffiliateMutation = ()=> {
    const navigate = useNavigate();

    return useMutation({
    mutationFn: createAffiliate,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      
      // userPermissions are automatically stored in localStorage by the login API
      
      navigate(constant.ROUTING_URLS.AFFILIATE);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        );
      }
      throw new Error("An unexpected error occurred");
    
    }
  });
}

  const useDeleteAffiliateMutation = (refetch: TRefetch) => useMutation({
    mutationFn: deleteAffiliate,
    onSuccess: () => {
      refetch()
      // setData((prev) =>
      //   prev.filter((row) => row.id !== response.id))
    },
    onError: (err: unknown) => {
      // normalize Axios error
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred"
        ); // 🔹 important: throw
      }
      throw new Error("An unexpected error occurred"); // 🔹 throw
    },
  });

/**
 * ##########################
 * User queries
 * ##########################
 */

const useUpdateUserMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: IUserFormData }) => updateUser(id, data),
  onSuccess: ()=>{
    navigate(constant.ROUTING_URLS.USERS);
  },
  onError: (err: unknown)=>{
    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  },
});
} 


const useDeleteUserMutation = ()=>useMutation({
  mutationFn: deleteUser,
  onSuccess: (data)=>{
    return data
  },
  onError: (err: unknown) => {
    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An unexpected error occurred"
      );
    }
    throw new Error("An unexpected error occurred");
  
    }
})

/** 
 * ################################
 *  Chauffeur
 * ################################
 */

const useCreateChauffeurMutation = ()=>{
  const navigate = useNavigate();
 return useMutation({
    mutationFn: createChauffeur,
  onSuccess: (response, variables) => {
    console.log(variables, response);
    // userPermissions are automatically stored in localStorage by the login API
    navigate(constant.ROUTING_URLS.CHAUFFEUR);
    // Navigate to dashboard
  },
  onError: (err: unknown) => {
    if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "An unexpected error occurred"
        );
      }
      throw new Error("An unexpected error occurred");
    },
  });
} 

export default {
    useDeletefleetMutation,
    useDeleteAffiliateMutation,
    useLoginMutation,
    useDeleteUserMutation,
    useCreateAffiliateMutation,
    useCreateChauffeurMutation,
    useUpdateUserMutation,
}