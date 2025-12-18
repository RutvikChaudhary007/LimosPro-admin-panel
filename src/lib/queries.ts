import {
  type QueryObserverResult,
  type RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  bulkDeleteAffiliate,
  bulkDeleteChauffeur,
  bulkDeleteCrewMember,
  bulkDeleteFAQById,
  bulkDeleteFleet,
  bulkDeleteIPWhiteListById,
  bulkDeleteNewsById,
  bulkDeletePartnerById,
  bulkDeleteStaffMember,
  bulkDeleteTestimonial,
  bulkDeleteTrips,
  bulkDeleteUser,
  createAffiliate,
  createChauffeur,
  createContentBlock,
  createCrewMember,
  createFAQ,
  createFleet,
  createIPWhiteList,
  createNews,
  createPartner,
  createRegion,
  createRegionAdmin,
  createStaffMember,
  createTestimonial,
  deleteAffiliate,
  deleteChauffeur,
  deleteContentBlock,
  deleteCrewMember,
  deleteFAQById,
  deleteFleet,
  deleteIPWhiteListById,
  deleteNewsById,
  deletePartnerById,
  deleteRegion,
  deleteRegionAdmin,
  deleteStaffMember,
  deleteTestimonial,
  deleteUser,
  editAffiliate,
  editChauffeur,
  editContentBlock,
  editCrewMember,
  editFAQById,
  editFleetById,
  editIPWhiteListById,
  editNewsById,
  editPartnerById,
  editRegion,
  editRegionAdmin,
  editStaffMember,
  editTestimonial,
  login,
  syncStaffPermissions,
  updateUser,
} from "@/api";
import { useUserStore } from "@/stores/useAuthStore";
import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import type { IUserFormData } from "@/types/user.type";
import { constant } from "./constant";

type TRefetch = (
  options?: RefetchOptions | undefined,
) => Promise<QueryObserverResult<unknown, Error>>;

// Auth
const useLoginMutation = () => {
  const { setUser } = useUserStore();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // You can still do things like storing localStorage, navigating, etc.
      const userData = response?.data;
      const userRole = userData?.roles;

      // reject unauthorized role
      if (
        !userRole ||
        !["Super Admin", "SEO Agent", "Affiliate"].includes(userRole)
      ) {
        //  return Promise.reject(new Error("Unauthorized user"));
        throw new Error("Unauthorized user");
      }

      setUser({
        ...response?.data,
        name: `${response?.data?.firstName} ${response?.data?.lastName}`,
      });
      return response; // let caller decide success toast message
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred",
        );
      } else if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred");
    },
  });
};

/**
 * ##########################################
 * Fleet
 * ##########################################
 * @param refetch
 * @returns
 */

const useCreatefleetMutation = () =>
  useMutation({
    mutationFn: createFleet,
    onSuccess: (res) => res,
    onError: (err: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      }

      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      // toast({
      //   title: "Delete fleet failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    },
  });

const useEditfleetMutation = () =>
  useMutation({
    mutationFn: editFleetById,
    onSuccess: (res) => res,
    onError: (err: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      }

      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      // toast({
      //   title: "Delete fleet failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    },
  });

const useDeletefleetMutation = (refetch: TRefetch) =>
  useMutation({
    mutationFn: deleteFleet,
    onSuccess: () => {
      refetch();
    },
    onError: (err: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      }

      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      // toast({
      //   title: "Delete fleet failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    },
  });

const useBulkDeletefleetMutation = () =>
  useMutation({
    mutationFn: bulkDeleteFleet,
    onSuccess: (res) => res,
    onError: (err: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      }

      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      // toast({
      //   title: "Delete fleet failed",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    },
  });

/**
 * #########################
 * Affiliate
 * #########################
 * */

const useCreateAffiliateMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useEditAffiliateMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteAffiliateMutation = (refetch: TRefetch) =>
  useMutation({
    mutationFn: deleteAffiliate,
    onSuccess: () => {
      refetch();
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
            "An unexpected error occurred",
        ); // 🔹 important: throw
      }
      throw new Error("An unexpected error occurred"); // 🔹 throw
    },
  });

const useBulkDeleteAffiliateMutation = () =>
  useMutation({
    mutationFn: bulkDeleteAffiliate,
    onSuccess: (res) => res,
    onError: (err: unknown) => {
      // normalize Axios error
      if (err && typeof err === "object" && "isAxiosError" in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        throw new Error(
          axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "An unexpected error occurred",
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

const useUpdateUserMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserFormData }) =>
      updateUser(id, data),
    onSuccess: () => {
      navigate(constant.ROUTING_URLS.USERS);
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteUserMutation = () =>
  useMutation({
    mutationFn: bulkDeleteUser,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ################################
 *  Chauffeur
 * ################################
 */

const useCreateChauffeurMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useEditChauffeurMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteChauffeurMutation = () =>
  useMutation({
    mutationFn: deleteChauffeur,
    onSuccess: (response, variables) => {
      console.log("variables:", variables);
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteChauffeurMutation = () =>
  useMutation({
    mutationFn: bulkDeleteChauffeur,
    onSuccess: (response, variables) => {
      console.log("variables:", variables);
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * #################################################
 * Crew Member
 * #################################################
 */

const useCreateCrewMemberMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useUpdateCrewMemberMutation = () =>
  useMutation({
    mutationFn: editCrewMember,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteCrewMemberMutation = () =>
  useMutation({
    mutationFn: deleteCrewMember,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteCrewMemberMutation = () =>
  useMutation({
    mutationFn: bulkDeleteCrewMember,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * Staff Member
 * ###################################################
 */

const useCreateStaffMemberMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useUpdateStaffMemberMutation = () => {
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
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteStaffMemberMutation = () =>
  useMutation({
    mutationFn: deleteStaffMember,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteStaffMemberMutation = () =>
  useMutation({
    mutationFn: bulkDeleteStaffMember,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useSyncStaffPermissionsMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: syncStaffPermissions,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * Testimonial
 * ###################################################
 */

const useCreateTestimonialMutation = () =>
  useMutation({
    mutationFn: createTestimonial,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditTestimonialMutation = () =>
  useMutation({
    mutationFn: editTestimonial,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * Delete Testimonial
 * ###################################################
 */
const useDeleteTestimonialMutation = () =>
  useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * Bulk Delete Testimonial
 * ###################################################
 */
const useBulkDeleteTestimonialMutation = () =>
  useMutation({
    mutationFn: bulkDeleteTestimonial,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * News
 * ###################################################
 */

const useCreateNewsMutation = () =>
  useMutation({
    mutationFn: createNews,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditNewsMutation = () =>
  useMutation({
    mutationFn: editNewsById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteNewsMutation = () =>
  useMutation({
    mutationFn: deleteNewsById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteNewsMutation = () =>
  useMutation({
    mutationFn: bulkDeleteNewsById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * Our Partner
 * ###################################################
 */

const useCreateOurPartnerMutation = () =>
  useMutation({
    mutationFn: createPartner,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditOurPartnerMutation = () =>
  useMutation({
    mutationFn: editPartnerById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteOurPartnerMutation = () =>
  useMutation({
    mutationFn: deletePartnerById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteOurPartnerMutation = () =>
  useMutation({
    mutationFn: bulkDeletePartnerById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * FAQ
 * ###################################################
 */

const useCreateFaqMutation = () =>
  useMutation({
    mutationFn: createFAQ,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditFaqMutation = () =>
  useMutation({
    mutationFn: editFAQById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteFaqMutation = () =>
  useMutation({
    mutationFn: deleteFAQById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteFaqMutation = () =>
  useMutation({
    mutationFn: bulkDeleteFAQById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * ###################################################
 * IP White List
 * ###################################################
 */

const useCreateIPWhiteListMutation = () =>
  useMutation({
    mutationFn: createIPWhiteList,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditIPWhiteListMutation = () =>
  useMutation({
    mutationFn: editIPWhiteListById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteIPWhiteListMutation = () =>
  useMutation({
    mutationFn: deleteIPWhiteListById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useBulkDeleteIPWhiteListMutation = () =>
  useMutation({
    mutationFn: bulkDeleteIPWhiteListById,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * #####################################
 * Trips
 * #####################################
 * @returns
 */

const useBulkDeleteTripsMutation = () =>
  useMutation({
    mutationFn: bulkDeleteTrips,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * #####################################
 * region
 * #####################################
 * @returns
 */

const useCreateRegionMutation = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createRegion,

    onSuccess: (data) => {
      ["Regions", "notifications"].forEach((key) =>
        clientQuery.invalidateQueries({ queryKey: [key] }),
      );
      return data;
    },

    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error ||
        "An unexpected error occurred";

      throw new Error(message);
    },
  });
};

const useEditRegionMutation = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: editRegion,

    onSuccess: (data) => {
      ["Regions", "notifications"].forEach((key) =>
        clientQuery.invalidateQueries({ queryKey: [key] }),
      );
      return data;
    },

    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error ||
        "An unexpected error occurred";

      throw new Error(message);
    },
  });
};

const useDeleteRegionMutation = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: deleteRegion,

    onSuccess: (data) => {
      ["Regions", "notifications"].forEach((key) =>
        clientQuery.invalidateQueries({ queryKey: [key] }),
      );
      return data;
    },

    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error ||
        "An unexpected error occurred";

      throw new Error(message);
    },
  });
};

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
      console.error("Mutation error:", err);
    },
  });

const useEditRegionAdminMutation = () =>
  useMutation({
    mutationFn: editRegionAdmin,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteRegionAdminMutation = () =>
  useMutation({
    mutationFn: deleteRegionAdmin,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

/**
 * #####################################
 * Content Block
 * #####################################
 * @returns
 */

const useCreateContentBlockMutation = () =>
  useMutation({
    mutationFn: createContentBlock,
    onSuccess: (data) => data,
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useEditContentBlockMutation = () =>
  useMutation({
    mutationFn: editContentBlock,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

const useDeleteContentBlockMutation = () =>
  useMutation({
    mutationFn: deleteContentBlock,
    onSuccess: (data) => {
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });

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
  useSyncStaffPermissionsMutation,
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
  useDeleteRegionAdminMutation,
  // Content Block
  useCreateContentBlockMutation,
  useEditContentBlockMutation,
  useDeleteContentBlockMutation,
};
