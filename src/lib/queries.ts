import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import { useMutation, type RefetchOptions, type QueryObserverResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { bulkDeletefleet, deletefleet } from "@/api/deleteFleet.api";
import { bulkDeleteAffiliate, deleteAffiliate } from "@/api/deleteAffiliate.api";
import { login } from "@/api/login.api";
import { useNavigate } from "react-router-dom";
import { constant } from "./constant";
import { bulkDeleteUser, deleteUser } from "@/api/deleteUser.api";
import { bulkDeleteChauffeur, createChauffeur, editChauffeur } from "@/api/chauffeur.api";
import type { IUserFormData } from "@/types/user.type";
import { updateUser } from "@/api/updateUserById.api";
import { createAffiliate } from "@/api/createAffiliate.api";
import { bulkDeleteStaffMember, createStaffMember, deleteStaffMember, editStaffMember } from "@/api/staffMember.api";
import { bulkDeleteCrewMember, createCrewMember, deleteCrewMember, editCrewMember } from "@/api/crewMember.api";
import { editAffiliate } from "@/api/editAffiliate.api";
import { deleteChauffeur } from "@/api/chauffeur.api";
import { bulkDeleteTestimonial, createTestimonial, deleteTestimonial, editTestimonial } from "@/api/testimonial.api";
import { createFleet } from "@/api/createFleet.api";
import { bulkDeleteNewsById, createNews, deleteNewsById, editNewsById } from "@/api/news.api";
import { bulkDeletePartnerById, createPartner, deletePartnerById, editPartnerById } from "@/api/ourPartners.api";
import { bulkDeleteFAQById, createFAQ, deleteFAQById, editFAQById } from "@/api/faq.api";
import { bulkDeleteIPWhiteListById, createIPWhiteList, deleteIPWhiteListById, editIPWhiteListById } from "@/api/ipWhiteList.api";
import { editFleetById } from "@/api/editFleetById.api";
import { bulkDeleteTrips } from "@/api/deleteTrips.api";
import { createRegion, deleteRegion, editRegion } from "@/api/region.api";
import { createRegionAdmin, deleteRegionAdmin, editRegionAdmin } from "@/api/regionAdmin.api";



type TRefetch= (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<unknown, Error>>

// Auth
const useLoginMutation = ()=> {
  const navigate = useNavigate()
  return useMutation({
  mutationFn: login,
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
      //  return Promise.reject(new Error("Unauthorized user"));
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
    }else if(err instanceof Error){
      throw err;
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


const useCreatefleetMutation = ()=> useMutation({
    mutationFn: createFleet,
    onSuccess: (res)=>res,
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

const useEditfleetMutation = ()=> useMutation({
    mutationFn: editFleetById,
    onSuccess: (res)=>res,
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

const useBulkDeletefleetMutation = ()=> useMutation({
    mutationFn: bulkDeletefleet,
    onSuccess: (res)=>res,
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
      return response;
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
  
const useEditAffiliateMutation = ()=> {
    const navigate = useNavigate();

    return useMutation({
    mutationFn: editAffiliate,
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

  const useBulkDeleteAffiliateMutation = () => useMutation({
    mutationFn: bulkDeleteAffiliate,
    onSuccess: (res) => res,
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

const useBulkDeleteUserMutation = ()=>useMutation({
  mutationFn: bulkDeleteUser,
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

const useEditChauffeurMutation = ()=>{
  const navigate = useNavigate();
 return useMutation({
    mutationFn: editChauffeur,
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

const useDeleteChauffeurMutation = ()=>useMutation({
  mutationFn: deleteChauffeur,
  onSuccess: (response, variables) => {
    console.log("variables:",variables);
    return response;
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

const useBulkDeleteChauffeurMutation = ()=>useMutation({
  mutationFn: bulkDeleteChauffeur,
  onSuccess: (response, variables) => {
    console.log("variables:",variables);
    return response;
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


/**
 * #################################################
 * Crew Member
 * #################################################
 */

const useCreateCrewMemberMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createCrewMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.CREW_MEMBERS);
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
  })
}

const useUpdateCrewMemberMutation = ()=>useMutation({
  mutationFn: editCrewMember,
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
    },
})

const useDeleteCrewMemberMutation = ()=>useMutation({
  mutationFn: deleteCrewMember,
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
    },
})

const useBulkDeleteCrewMemberMutation = ()=>useMutation({
  mutationFn: bulkDeleteCrewMember,
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
    },
})

/**
 * ###################################################
 * Staff Member
 * ###################################################
 */

const useCreateStaffMemberMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
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
  })
}

const useUpdateStaffMemberMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editStaffMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
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
})
}

const useDeleteStaffMemberMutation = ()=>useMutation({
  mutationFn: deleteStaffMember,
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
    },
})

const useBulkDeleteStaffMemberMutation = ()=>useMutation({
  mutationFn: bulkDeleteStaffMember,
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
    },
})

/**
 * ###################################################
 * Testimonial
 * ###################################################
 */

const useCreateTestimonialMutation = ()=>useMutation({
  mutationFn: createTestimonial,
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
    },
})

const useEditTestimonialMutation = ()=>useMutation({
  mutationFn: editTestimonial,
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
    },
});

/**
 * ###################################################
 * Delete Testimonial
 * ###################################################
 */
const useDeleteTestimonialMutation = ()=>useMutation({
  mutationFn: deleteTestimonial,
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
    },
})

/**
 * ###################################################
 * Bulk Delete Testimonial
 * ###################################################
 */
const useBulkDeleteTestimonialMutation = ()=>useMutation({
  mutationFn: bulkDeleteTestimonial,
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
    },
})

/**
 * ###################################################
 * News
 * ###################################################
 */

const useCreateNewsMutation = ()=>useMutation({
  mutationFn: createNews,
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
    },
})

const useEditNewsMutation = ()=>useMutation({
  mutationFn: editNewsById,
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
    },
})

const useDeleteNewsMutation = ()=>useMutation({
  mutationFn: deleteNewsById,
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
    },
})

const useBulkDeleteNewsMutation = ()=>useMutation({
  mutationFn: bulkDeleteNewsById,
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
    },
})

/**
 * ###################################################
 * Our Partner
 * ###################################################
 */

const useCreateOurPartnerMutation = ()=>useMutation({
  mutationFn: createPartner,
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
    },
})

const useEditOurPartnerMutation = ()=>useMutation({
  mutationFn: editPartnerById,
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
    },
})

const useDeleteOurPartnerMutation = ()=>useMutation({
  mutationFn: deletePartnerById,
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
    },
})

const useBulkDeleteOurPartnerMutation = ()=>useMutation({
  mutationFn: bulkDeletePartnerById,
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
    },
})


/**
 * ###################################################
 * FAQ
 * ###################################################
 */

const useCreateFaqMutation = ()=>useMutation({
  mutationFn: createFAQ,
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
    },
})

const useEditFaqMutation = ()=>useMutation({
  mutationFn: editFAQById,
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
    },
})

const useDeleteFaqMutation = ()=>useMutation({
  mutationFn: deleteFAQById,
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
    },
})

const useBulkDeleteFaqMutation = ()=>useMutation({
  mutationFn: bulkDeleteFAQById,
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
    },
})

/**
 * ###################################################
 * IP White List
 * ###################################################
 */

const useCreateIPWhiteListMutation = ()=>useMutation({
  mutationFn: createIPWhiteList,
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
    },
})

const useEditIPWhiteListMutation = ()=>useMutation({
  mutationFn: editIPWhiteListById,
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
    },
})

const useDeleteIPWhiteListMutation = ()=>useMutation({
  mutationFn: deleteIPWhiteListById,
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
    },
})

const useBulkDeleteIPWhiteListMutation = ()=>useMutation({
  mutationFn: bulkDeleteIPWhiteListById,
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
    },
})


/**
 * #####################################
 * Trips
 * #####################################
 * @returns 
 */

const useBulkDeleteTripsMutation = ()=>useMutation({
  mutationFn: bulkDeleteTrips,
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
    },
})

/**
 * #####################################
 * region
 * #####################################
 * @returns 
 */

const useCreateRegionMutation = ()=>useMutation({
  mutationFn: createRegion,
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
    },
})

const useEditRegionMutation = ()=>useMutation({
  mutationFn: editRegion,
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
    },
})

const useDeleteRegionMutation = ()=>useMutation({
  mutationFn: deleteRegion,
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
    },
})

/**
 * #####################################
 * Region Admin
 * #####################################
 * @returns 
 */

const useCreateRegionAdminMutation = ()=>useMutation({
  mutationFn: createRegionAdmin,
  onSuccess: (data)=> data,
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
})

const useEditRegionAdminMutation = ()=>useMutation({
  mutationFn: editRegionAdmin,
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
    },
})

const useDeleteRegionAdminMutation = ()=>useMutation({
  mutationFn: deleteRegionAdmin,
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
    },
})



export default {
  // Auth
    useLoginMutation,
    // Fleet
    useCreatefleetMutation,
    useEditfleetMutation,
    useDeletefleetMutation,
    useBulkDeletefleetMutation,
    // User
    useUpdateUserMutation,
    useDeleteUserMutation,
    useBulkDeleteUserMutation,
    // Affiliate
    useCreateAffiliateMutation,
    useEditAffiliateMutation,
    useDeleteAffiliateMutation,
    useBulkDeleteAffiliateMutation,
    // Chauffeur
    useCreateChauffeurMutation,
    useEditChauffeurMutation,
    useDeleteChauffeurMutation,
    useBulkDeleteChauffeurMutation,
    // Crew Member
    useCreateCrewMemberMutation,
    useUpdateCrewMemberMutation,
    useDeleteCrewMemberMutation,
    useBulkDeleteCrewMemberMutation,
    // Staff Member
    useCreateStaffMemberMutation,
    useDeleteStaffMemberMutation,
    useUpdateStaffMemberMutation,
    useBulkDeleteStaffMemberMutation,
    // Testimonial
    useCreateTestimonialMutation,
    useEditTestimonialMutation,
    useDeleteTestimonialMutation,
    useBulkDeleteTestimonialMutation,
    // News
    useCreateNewsMutation,
    useEditNewsMutation,
    useDeleteNewsMutation,
    useBulkDeleteNewsMutation,
    // Our Partner
    useCreateOurPartnerMutation,
    useEditOurPartnerMutation,
    useDeleteOurPartnerMutation,
    useBulkDeleteOurPartnerMutation,
    // FAQ
    useCreateFaqMutation,
    useEditFaqMutation,
    useDeleteFaqMutation,
    useBulkDeleteFaqMutation,
    // IP White List
    useCreateIPWhiteListMutation,
    useEditIPWhiteListMutation,
    useDeleteIPWhiteListMutation,
    useBulkDeleteIPWhiteListMutation,
    // Trips
    useBulkDeleteTripsMutation,
    // region
    useCreateRegionMutation,
    useEditRegionMutation,
    useDeleteRegionMutation,
    // region admin
    useCreateRegionAdminMutation,
    useEditRegionAdminMutation,
    useDeleteRegionAdminMutation
}