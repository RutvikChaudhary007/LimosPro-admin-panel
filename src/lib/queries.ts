import {
  type QueryObserverResult,
  type RefetchOptions,
  useMutation,
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
import { useInvalidateModule } from "@/hooks/useInvalidateModule";
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
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createFleet,
    onSuccess: (res) => {
      invalidate.vehicle();
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
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editFleetById,
    onSuccess: (res) => {
      invalidate.vehicle();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteFleet,
    onSuccess: () => {
      invalidate.vehicle();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteFleet,
    onSuccess: (res) => {
      invalidate.vehicle();
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
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createServicePricing,
    onSuccess: (res) => {
      invalidate.servicePricing();
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
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editServicePricingById,
    onSuccess: (res) => {
      invalidate.servicePricing();
      invalidate.servicePricing(res?.data?.id);
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteServicePricing,
    onSuccess: () => {
      invalidate.servicePricing();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteServicePricing,
    onSuccess: (res) => {
      invalidate.servicePricing();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: createPartner,
    onSuccess: (response) => {
      invalidate.partner();
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditPartnerMutation = () => {
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: editPartner,
    onSuccess: (_response, variables) => {
      invalidate.partner(
        typeof variables === "object" && variables && "id" in variables
          ? (variables as { id: string }).id
          : undefined,
      );
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeletePartnerMutation = (refetch: TRefetch) => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      invalidate.partner();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeletePartner,
    onSuccess: (res) => {
      invalidate.partner();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserFormData }) =>
      updateUser(id, data),
    onSuccess: (_data, variables) => {
      invalidate.user(variables.id);
      navigate(constant.ROUTING_URLS.USERS);
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteUserMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      invalidate.user();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteUserMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteUser,
    onSuccess: (data) => {
      invalidate.user();
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
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createChauffeur,
    onSuccess: () => {
      invalidate.chauffeur();
      navigate(constant.ROUTING_URLS.CHAUFFEUR);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditChauffeurMutation = () => {
  const { invalidate } = useInvalidateModule();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editChauffeur,
    onSuccess: (_response, variables) => {
      invalidate.chauffeur(variables?.id);
      navigate(constant.ROUTING_URLS.CHAUFFEUR);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteChauffeurMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteChauffeur,
    onSuccess: (response, variables) => {
      invalidate.chauffeur(
        typeof variables === "string" ? variables : undefined,
      );
      return response;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteChauffeurMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteChauffeur,
    onSuccess: (response) => {
      invalidate.chauffeur();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createCrewMember,
    onSuccess: () => {
      invalidate.crewMember();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editCrewMember,
    onSuccess: (data, variables) => {
      invalidate.crewMember(variables?.id);
      navigate(constant.ROUTING_URLS.CREW_MEMBERS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteCrewMemberMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteCrewMember,
    onSuccess: (data) => {
      invalidate.crewMember();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteCrewMemberMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteCrewMember,
    onSuccess: (data) => {
      invalidate.crewMember();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      invalidate.staffMember();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editStaffMember,
    onSuccess: (_response, variables) => {
      invalidate.staffMember(variables?.id);
      navigate(constant.ROUTING_URLS.STAFF_MEMBERS);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteStaffMemberMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteStaffMember,
    onSuccess: (data) => {
      invalidate.staffMember();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteStaffMemberMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteStaffMember,
    onSuccess: (data) => {
      invalidate.staffMember();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: (data) => {
      invalidate.testimonial();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editTestimonial,
    onSuccess: (data, variables) => {
      invalidate.testimonial(variables?.id);
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: (data) => {
      invalidate.testimonial();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteTestimonial,
    onSuccess: (data) => {
      invalidate.testimonial();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createNews,
    onSuccess: (data) => {
      invalidate.news();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editNewsById,
    onSuccess: (data, variables) => {
      invalidate.news(variables?.id);
      navigate(constant.ROUTING_URLS.NEWS);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteNewsMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteNewsById,
    onSuccess: (data) => {
      invalidate.news();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteNewsMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteNewsById,
    onSuccess: (data) => {
      invalidate.news();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createFAQ,
    onSuccess: (data) => {
      invalidate.faq();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditFaqMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editFAQById,
    onSuccess: (data, variables) => {
      invalidate.faq(variables?.id);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteFaqMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteFAQById,
    onSuccess: (data) => {
      invalidate.faq();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteFaqMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteFAQById,
    onSuccess: (data) => {
      invalidate.faq();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createIPWhiteList,
    onSuccess: (data) => {
      invalidate.ipWhiteList();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editIPWhiteListById,
    onSuccess: (data, variables) => {
      invalidate.ipWhiteList(variables?.id);
      navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteIPWhiteListMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteIPWhiteListById,
    onSuccess: (data) => {
      invalidate.ipWhiteList();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteIPWhiteListMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteIPWhiteListById,
    onSuccess: (data) => {
      invalidate.ipWhiteList();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteTrips,
    onSuccess: (data) => {
      invalidate.trip();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: createRegion,

    onSuccess: (data) => {
      invalidate.region();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: editRegion,

    onSuccess: (data, variables) => {
      invalidate.region(variables?.id);
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: deleteRegion,

    onSuccess: (data) => {
      invalidate.region();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: bulkDeleteRegions,

    onSuccess: (data) => {
      invalidate.region();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: createRegionAdmin,
    onSuccess: (data) => {
      invalidate.regionalAdmin();
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
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: editRegionAdmin,
    onSuccess: (data, variables) => {
      invalidate.regionalAdmin(variables?.id);
      navigate(constant.ROUTING_URLS.REGION_ADMIN);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteRegionAdminMutation = () => {
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: deleteRegionAdmin,
    onSuccess: (data) => {
      invalidate.regionalAdmin();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useBulkDeleteRegionAdminsMutation = () => {
  const { invalidate } = useInvalidateModule();

  return useMutation({
    mutationFn: bulkDeleteRegionAdmins,
    onSuccess: (data) => {
      invalidate.regionalAdmin();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createContentBlock,
    onSuccess: (data) => {
      invalidate.contentBlock();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: editContentBlock,
    onSuccess: (data, variables) => {
      invalidate.contentBlock(variables?.id);
      navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES);
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useDeleteContentBlockMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteContentBlock,
    onSuccess: (data) => {
      invalidate.contentBlock();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: (data: FormData) => blogService.create(data),
    onSuccess: () => {
      invalidate.blog();
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    },
  });
};

const useUpdateBlogPostMutation = () => {
  const navigate = useNavigate();
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      blogService.update(id, data),
    onSuccess: (_data, variables) => {
      invalidate.blog(variables?.id);
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      invalidate.payment();
      invalidate.refund();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createServicePageContent,
    onSuccess: (data) => {
      invalidate.servicePageContent();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditServicePageContentMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: updateServicePageContent,
    onSuccess: (_, variables) => {
      invalidate.servicePageContent(variables?.id);
    },
  });
};

const useDeleteServicePageContentMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteServicePageContent,
    onSuccess: () => {
      invalidate.servicePageContent();
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
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createDestinationPageContent,
    onSuccess: (data) => {
      invalidate.destinationPageContent();
      return data;
    },
    onError: (err: unknown) => {
      console.error("Mutation error:", err);
    },
  });
};

const useEditDestinationPageContentMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: updateDestinationPageContent,
    onSuccess: (_, variables) => {
      invalidate.destinationPageContent(variables?.id);
    },
  });
};

const useDeleteDestinationPageContentMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteDestinationPageContent,
    onSuccess: () => {
      invalidate.destinationPageContent();
    },
  });
};

// Tags mutations
const useCreateTagMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      invalidate.tag();
    },
  });
};

const useEditTagMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateTag(id, data),
    onSuccess: (_data, variables) => {
      invalidate.tag(variables?.id);
    },
  });
};

const useDeleteTagMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      invalidate.tag();
    },
  });
};

const useBulkDeleteTagsMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteTags,
    onSuccess: () => {
      invalidate.tag();
    },
  });
};

// Meta Keywords mutations
const useCreateMetaKeywordMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: createMetaKeyword,
    onSuccess: () => {
      invalidate.metaKeyword();
    },
  });
};

const useEditMetaKeywordMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateMetaKeyword(id, data),
    onSuccess: (_data, variables) => {
      invalidate.metaKeyword(variables?.id);
    },
  });
};

const useDeleteMetaKeywordMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: deleteMetaKeyword,
    onSuccess: () => {
      invalidate.metaKeyword();
    },
  });
};

const useBulkDeleteMetaKeywordsMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: bulkDeleteMetaKeywords,
    onSuccess: () => {
      invalidate.metaKeyword();
    },
  });
};

// Media mutations
const useUploadMediaMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: (data: any) => mediaService.upload(data),
    onSuccess: () => {
      invalidate.media();
    },
  });
};

const useUploadMultipleMediaMutation = () => {
  const { invalidate } = useInvalidateModule();
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
      invalidate.media();
    },
  });
};

const useUpdateMediaMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mediaService.update(id, data),
    onSuccess: (_data, variables) => {
      invalidate.media(variables?.id);
    },
  });
};

const useDeleteMediaMutation = () => {
  const { invalidate } = useInvalidateModule();
  return useMutation({
    mutationFn: (id: string) => mediaService.delete(id),
    onSuccess: () => {
      invalidate.media();
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
