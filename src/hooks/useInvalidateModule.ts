import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Centralized cache invalidation for React Query.
 * Use after create/update/delete mutations to invalidate module list + detail.
 *
 * @example
 * const invalidate = useInvalidateModule();
 * onSuccess: (_, variables) => invalidate.region(variables.id);
 */
export function useInvalidateModule() {
  const queryClient = useQueryClient();

  const invalidate = {
    booking: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.booking.detail(id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.booking.history(id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.booking.notes(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.booking.lists() });
    },

    region: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.region.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.region.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.lists(),
      });
    },

    chauffeur: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chauffeur.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.chauffeur.lists() });
    },

    partner: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.partner.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.partner.lists() });
    },

    vehicle: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.vehicle.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.lists() });
    },

    vehicleType: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.vehicleType.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.vehicleType.lists(),
      });
    },

    blog: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.blog.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.lists() });
    },

    regionalAdmin: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.regionalAdmin.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.regionalAdmin.lists(),
      });
    },

    user: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user.lists() });
    },

    servicePricing: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.servicePricing.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicePricing.lists(),
      });
    },

    staffMember: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.staffMember.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffMember.lists(),
      });
    },

    crewMember: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.crewMember.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.crewMember.lists(),
      });
    },

    testimonial: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.testimonial.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonial.lists(),
      });
    },

    news: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.news.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.news.lists() });
    },

    faq: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.faq.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.faq.lists() });
    },

    ipWhiteList: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.ipWhiteList.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.ipWhiteList.lists(),
      });
    },

    trip: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.trip.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.trip.lists() });
    },

    contentBlock: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.contentBlock.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.contentBlock.lists(),
      });
    },

    payment: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.payment.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.lists() });
    },

    refund: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.refund.lists() });
    },

    servicePageContent: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.servicePageContent.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicePageContent.lists(),
      });
    },

    destinationPageContent: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.destinationPageContent.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinationPageContent.lists(),
      });
    },

    tag: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.tag.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.tag.lists() });
    },

    metaKeyword: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.metaKeyword.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.metaKeyword.lists(),
      });
    },

    media: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.media.detail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.media.lists() });
    },

    notification: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.notification.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.notification.lists(),
      });
    },

    supportTicket: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.supportTicket.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.supportTicket.lists(),
      });
    },

    partnerTransaction: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.partnerTransaction.all,
      });
    },

    siteSetting: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSetting.ui() });
    },

    homePage: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.homePage.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.homePage.all,
      });
    },

    chauffeurPage: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chauffeurPage.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.chauffeurPage.all,
      });
    },

    businessPageLayout: (id?: string) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.businessPageLayout.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessPageLayout.all,
      });
    },
  };

  return { invalidate, queryClient };
}
