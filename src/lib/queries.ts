import {
  type QueryObserverResult,
  type RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  blogService,
  bulkDeleteChauffeur,
  bulkDeleteCrewMember,
  bulkDeleteFAQById,
  bulkDeleteFleet,
  bulkDeleteIPWhiteListById,
  bulkDeleteMetaKeywords,
  bulkDeleteNewsById,
  bulkDeletePartner,
  bulkDeleteRegionAdmins,
  bulkDeleteRegions,
  bulkDeleteStaffMember,
  bulkDeleteTags,
  bulkDeleteTestimonial,
  bulkDeleteTrips,
  bulkDeleteUser,
  createChauffeur,
  createContentBlock,
  createCrewMember,
  createFAQ,
  createFleet,
  createIPWhiteList,
  createMetaKeyword,
  createNews,
  createPartner,
  createRegion,
  createRegionAdmin,
  createStaffMember,
  createTag,
  createTestimonial,
  deleteChauffeur,
  deleteContentBlock,
  deleteCrewMember,
  deleteFAQById,
  deleteFleet,
  deleteIPWhiteListById,
  deleteMetaKeyword,
  deleteNewsById,
  deletePartner,
  deleteRegion,
  deleteRegionAdmin,
  deleteStaffMember,
  deleteTag,
  deleteTestimonial,
  deleteUser,
  editChauffeur,
  editContentBlock,
  editCrewMember,
  editFAQById,
  editFleetById,
  editIPWhiteListById,
  editNewsById,
  editPartner,
  editRegion,
  editRegionAdmin,
  editStaffMember,
  editTestimonial,
  login,
  mediaService,
  refundPayment,
  syncUserPermissions,
  updateMetaKeyword,
  updateTag,
  updateUser,
} from "@/api";
import {
  createDestinationPageContent,
  deleteDestinationPageContent,
  updateDestinationPageContent,
} from "@/api/pages/destinationPage.api";
import {
  createServicePageContent,
  deleteServicePageContent,
  updateServicePageContent,
} from "@/api/pages/servicePages.api";
import {
  bulkDeleteServicePricing,
  createServicePricing,
  deleteServicePricing,
  editServicePricingById,
} from "@/api/servicePricing.api";
import { useUserStore } from "@/stores/useAuthStore";
import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import type { IUserFormData } from "@/types/user.type";
import { constant } from "./constant";

type TRefetch = (
  options?: RefetchOptions | undefined,
) => Promise<QueryObserverResult<unknown, Error>>;

const allowedRoles = new Set(constant.ADMIN_ELIGIBLE_ROLES);
// Auth
const useLoginMutation = () => {
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const data = response?.data;
      const rawRoles = [data?.roles].flat();

      // Filter roles to only include admin-eligible ones
      const adminEligibleRoles = rawRoles.filter((r) => allowedRoles.has(r));

      if (adminEligibleRoles.length === 0) {
        throw new Error("You do not have permission to access admin panel");
      }

      // If multiple roles exist, ensure the primary 'role' is an admin-eligible one
      const priority = [
        "Super Admin",
        "Regional Admin",
        "Dispatcher",
        "Partner",
        "Chauffeur",
        "Staff Member",
        "SEO Agent",
      ];
      const primaryRole =
        priority.find((r) => adminEligibleRoles.includes(r)) ||
        adminEligibleRoles[0];

      // Save primary role to localStorage for redirect checks
      localStorage.setItem("role", primaryRole);

      setUser({
        ...data,
        roles: adminEligibleRoles,
        name: `${data?.firstName} ${data?.lastName}`,
      });

      return response;
    },

    onError: (err: unknown) => {
      if ((err as any)?.isAxiosError) {
        const e = err as AxiosError<ApiErrorResponse>;
        throw new Error(
          e.response?.data?.message ||
            e.response?.data?.error ||
            "An unexpected error occurred",
        );
      }
      throw err instanceof Error
        ? err
        : new Error("An unexpected error occurred");
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

const useCreatefleetMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createFleet,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Fleets"] });
      navigate(constant.ROUTING_URLS.FLEETS);
      return res;
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
};

const useEditfleetMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editFleetById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Fleets"] });
      navigate(constant.ROUTING_URLS.FLEETS);
      return res;
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
};

const useDeletefleetMutation = (refetch: TRefetch) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFleet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Fleets"] });
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
};

const useBulkDeletefleetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteFleet,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Fleets"] });
      return res;
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
};

/**
 * ##########################################
 * Service Pricing
 * ##########################################
 */

const useCreateServicePricingMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createServicePricing,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ServicePricings"] });
      navigate(constant.ROUTING_URLS.SERVICE_PRICING);
      return res;
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

      if (errorMessage.includes("429")) return;
    },
  });
};

const useEditServicePricingMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editServicePricingById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ServicePricings"] });
      navigate(constant.ROUTING_URLS.SERVICE_PRICING);
      return res;
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

      if (errorMessage.includes("429")) return;
    },
  });
};

const useDeleteServicePricingMutation = (refetch: TRefetch) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServicePricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ServicePricings"] });
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

      if (errorMessage.includes("429")) return;
    },
  });
};

const useBulkDeleteServicePricingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteServicePricing,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ServicePricings"] });
      return res;
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

      if (errorMessage.includes("429")) return;
    },
  });
};

/**
 * #########################
 * Partner
 * #########################
 * */

const useCreatePartnerMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPartner,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      // userPermissions are automatically stored in localStorage by the login API

      navigate(constant.ROUTING_URLS.PARTNER);
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditPartnerMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPartner,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partnerById"] });
      // userPermissions are automatically stored in localStorage by the login API

      navigate(constant.ROUTING_URLS.PARTNER);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeletePartnerMutation = (refetch: TRefetch) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
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
};

const useBulkDeletePartnerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeletePartner,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      return res;
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
};

/**
 * ##########################
 * User queries
 * ##########################
 */

const useUpdateUserMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserFormData }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate(constant.ROUTING_URLS.USERS);
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ################################
 *  Chauffeur
 * ################################
 */

const useCreateChauffeurMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createChauffeur,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["chauffeurs"] });
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editChauffeur,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["chauffeurs"] });
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.CHAUFFEUR);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteChauffeurMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChauffeur,
    onSuccess: (response, variables) => {
      console.log("variables:", variables);
      queryClient.invalidateQueries({ queryKey: ["chauffeurs"] });
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteChauffeurMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteChauffeur,
    onSuccess: (response, variables) => {
      console.log("variables:", variables);
      queryClient.invalidateQueries({ queryKey: ["chauffeurs"] });
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * #################################################
 * Crew Member
 * #################################################
 */

const useCreateCrewMemberMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCrewMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["crewMember"] });
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.CREW_MEMBERS);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useUpdateCrewMemberMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editCrewMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crewMember"] });
      navigate(constant.ROUTING_URLS.CREW_MEMBERS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteCrewMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCrewMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crewMember"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteCrewMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteCrewMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["crewMember"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * Staff Member
 * ###################################################
 */

const useCreateStaffMemberMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["staffMember"] });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editStaffMember,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      queryClient.invalidateQueries({ queryKey: ["staffMember"] });
      // userPermissions are automatically stored in localStorage by the login API
      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteStaffMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaffMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffMember"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteStaffMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteStaffMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["staffMember"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useSyncStaffPermissionsMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: syncUserPermissions,
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

const useCreateTestimonialMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      navigate(constant.ROUTING_URLS.TESTIMONIALS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditTestimonialMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editTestimonial,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      navigate(constant.ROUTING_URLS.TESTIMONIALS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * Delete Testimonial
 * ###################################################
 */
const useDeleteTestimonialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * Bulk Delete Testimonial
 * ###################################################
 */
const useBulkDeleteTestimonialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteTestimonial,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * News
 * ###################################################
 */

const useCreateNewsMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      navigate(constant.ROUTING_URLS.NEWS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditNewsMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editNewsById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      navigate(constant.ROUTING_URLS.NEWS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNewsById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteNewsById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * FAQ
 * ###################################################
 */

const useCreateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFAQ,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      // navigate(constant.ROUTING_URLS.FAQ); // Removed navigate usage
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editFAQById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      // navigate(constant.ROUTING_URLS.FAQ); // Removed navigate usage
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFAQById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteFAQById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * ###################################################
 * IP White List
 * ###################################################
 */

const useCreateIPWhiteListMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIPWhiteList,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ipWhiteList"] });
      navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditIPWhiteListMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editIPWhiteListById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ipWhiteList"] });
      navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteIPWhiteListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIPWhiteListById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ipWhiteList"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteIPWhiteListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteIPWhiteListById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ipWhiteList"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * #####################################
 * Trips
 * #####################################
 * @returns
 */

const useBulkDeleteTripsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteTrips,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["Trips"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * #####################################
 * region
 * #####################################
 * @returns
 */

const useCreateRegionMutation = () => {
  const navigate = useNavigate();
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: createRegion,

    onSuccess: (data) => {
      ["Regions", "notifications"].forEach((key) =>
        clientQuery.invalidateQueries({ queryKey: [key] }),
      );
      navigate(constant.ROUTING_URLS.REGION);
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
  const navigate = useNavigate();
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: editRegion,

    onSuccess: (data) => {
      ["Regions", "notifications"].forEach((key) =>
        clientQuery.invalidateQueries({ queryKey: [key] }),
      );
      navigate(constant.ROUTING_URLS.REGION);
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

const useBulkDeleteRegionsMutation = () => {
  const clientQuery = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteRegions,

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

const useCreateRegionAdminMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRegionAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["RegionAdmins"] });
      navigate(constant.ROUTING_URLS.REGION_ADMIN);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditRegionAdminMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editRegionAdmin,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["RegionAdmins"] });
      queryClient.invalidateQueries({
        queryKey: ["RegionAdminById", { id: variables.id }],
      });
      navigate(constant.ROUTING_URLS.REGION_ADMIN);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteRegionAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRegionAdmin,
    onSuccess: (data) => {
      ["RegionAdmins"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteRegionAdminsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteRegionAdmins,
    onSuccess: (data) => {
      ["RegionAdmins"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * #####################################
 * Content Block
 * #####################################
 * @returns
 */

const useCreateContentBlockMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContentBlock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ContentBlocks"] });
      navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditContentBlockMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editContentBlock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ContentBlocks"] });
      navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteContentBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContentBlock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ContentBlocks"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

/**
 * #####################################
 * Blog Post
 * #####################################
 * @returns
 */
const useCreateBlogPostMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => blogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    },
  });
};

const useUpdateBlogPostMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      blogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    },
  });
};

/**
 * #####################################
 * Payment refunds
 * #####################################
 * @returns
 */
const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Payments"] });
      queryClient.invalidateQueries({ queryKey: ["Refunds"] });
    },
  });
};

/**
 * #####################################
 * Service Page Content
 * #####################################
 * @returns
 */

const useCreateServicePageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServicePageContent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["servicePageContent"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditServicePageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServicePageContent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["servicePageContent"] });
      queryClient.invalidateQueries({
        queryKey: ["servicePageContent", variables.id],
      });
    },
  });
};

const useDeleteServicePageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServicePageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicePageContent"] });
    },
  });
};

/**
 * #####################################
 * Destination Page Content
 * #####################################
 * @returns
 */

const useCreateDestinationPageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDestinationPageContent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["destinationPageContent"] });
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditDestinationPageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDestinationPageContent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["destinationPageContent"] });
      queryClient.invalidateQueries({
        queryKey: ["destinationPageContent", variables.id],
      });
    },
  });
};

const useDeleteDestinationPageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDestinationPageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinationPageContent"] });
    },
  });
};

// Tags mutations
const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

const useEditTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

const useBulkDeleteTagsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteTags,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

// Meta Keywords mutations
const useCreateMetaKeywordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMetaKeyword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metaKeywords"] });
    },
  });
};

const useEditMetaKeywordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateMetaKeyword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metaKeywords"] });
    },
  });
};

const useDeleteMetaKeywordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMetaKeyword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metaKeywords"] });
    },
  });
};

const useBulkDeleteMetaKeywordsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteMetaKeywords,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metaKeywords"] });
    },
  });
};

// Media mutations
const useUploadMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => mediaService.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

const useUploadMultipleMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      category,
      folder,
    }: {
      files: File[];
      category?: string;
      folder?: string;
    }) => mediaService.uploadMultiple(files, category, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

const useUpdateMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mediaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mediaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export default {
  // Auth
  useLoginMutation,
  // Fleet
  useCreatefleetMutation,
  useEditfleetMutation,
  useDeletefleetMutation,
  useBulkDeletefleetMutation,
  // Service Pricing
  useCreateServicePricingMutation,
  useEditServicePricingMutation,
  useDeleteServicePricingMutation,
  useBulkDeleteServicePricingMutation,
  // User
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkDeleteUserMutation,
  // Partner
  useCreatePartnerMutation,
  useEditPartnerMutation,
  useDeletePartnerMutation,
  useBulkDeletePartnerMutation,
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
  useBulkDeleteRegionsMutation,
  // region admin
  useCreateRegionAdminMutation,
  useEditRegionAdminMutation,
  useDeleteRegionAdminMutation,
  useBulkDeleteRegionAdminsMutation,
  // Content Block
  useCreateContentBlockMutation,
  useEditContentBlockMutation,
  useDeleteContentBlockMutation,
  // Payment Refund
  useRefundPaymentMutation,
  // Service Page Content
  useCreateServicePageContentMutation,
  useEditServicePageContentMutation,
  useDeleteServicePageContentMutation,
  // Destination Page Content
  useCreateDestinationPageContentMutation,
  useEditDestinationPageContentMutation,
  useDeleteDestinationPageContentMutation,
  // Blog
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  // Tags
  useCreateTagMutation,
  useEditTagMutation,
  useDeleteTagMutation,
  useBulkDeleteTagsMutation,
  // Meta Keywords
  useCreateMetaKeywordMutation,
  useEditMetaKeywordMutation,
  useDeleteMetaKeywordMutation,
  useBulkDeleteMetaKeywordsMutation,
  // Media
  useUploadMediaMutation,
  useUploadMultipleMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
};
