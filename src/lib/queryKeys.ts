/**
 * Centralized React Query key factory.
 * Use for all useQuery/useMutation queryKey and invalidation.
 * Pattern: all | lists() | listParams(...) | detail(id)
 */

export const queryKeys = {
  booking: {
    all: ["booking"] as const,
    lists: () => ["booking", "list"] as const,
    listParams: (
      dateRange?: unknown,
      page?: number,
      limit?: number,
      status?: string,
    ) => ["booking", "list", dateRange, page, limit, status] as const,
    detail: (id: string | undefined) => ["booking", "detail", id] as const,
    history: (bookingId: string | undefined) =>
      ["booking", "history", bookingId] as const,
    notes: (bookingId: string | undefined) =>
      ["booking", "notes", bookingId] as const,
  },

  region: {
    all: ["region"] as const,
    lists: () => ["region", "list"] as const,
    listParams: (data?: { page?: number; limit?: number }) =>
      ["region", "list", data] as const,
    detail: (id: string) => ["region", "detail", id] as const,
  },

  chauffeur: {
    all: ["chauffeur"] as const,
    lists: () => ["chauffeur", "list"] as const,
    listParams: (
      dateRange?: unknown,
      page?: number,
      limit?: number,
      status?: string,
    ) => ["chauffeur", "list", dateRange, page, limit, status] as const,
    detail: (id: string) => ["chauffeur", "detail", id] as const,
  },

  partner: {
    all: ["partner"] as const,
    lists: () => ["partner", "list"] as const,
    listParams: (
      dateRange?: unknown,
      page?: number,
      limit?: number,
      status?: string,
    ) => ["partner", "list", dateRange, page, limit, status] as const,
    detail: (id: string | undefined) => ["partner", "detail", id] as const,
    partnerReport: (
      startDate: unknown,
      endDate: unknown,
      page: number,
      perPage: number,
    ) => ["partner", "report", startDate, endDate, page, perPage] as const,
  },

  vehicle: {
    all: ["vehicle"] as const,
    lists: () => ["vehicle", "list"] as const,
    listParams: (dateRange?: unknown, page?: number, limit?: number) =>
      ["vehicle", "list", dateRange, page, limit] as const,
    detail: (id: string) => ["vehicle", "detail", id] as const,
  },

  blog: {
    all: ["blog"] as const,
    lists: () => ["blog", "list"] as const,
    detail: (id: string) => ["blog", "detail", id] as const,
  },

  regionalAdmin: {
    all: ["regionalAdmin"] as const,
    lists: () => ["regionalAdmin", "list"] as const,
    listParams: (data?: { page?: number; limit?: number }) =>
      ["regionalAdmin", "list", data] as const,
    detail: (id: string) => ["regionalAdmin", "detail", id] as const,
  },

  user: {
    all: ["user"] as const,
    lists: () => ["user", "list"] as const,
    listParams: (
      dateRange?: unknown,
      page?: number,
      status?: string,
      limit?: number,
      role?: string,
    ) => ["user", "list", dateRange, page, status, limit, role] as const,
    detail: (id: string | undefined) => ["user", "detail", id] as const,
  },

  // --- Additional modules (same pattern for scalability) ---

  servicePricing: {
    all: ["servicePricing"] as const,
    lists: () => ["servicePricing", "list"] as const,
    listParams: (dateRange?: unknown, page?: number, limit?: number) =>
      ["servicePricing", "list", dateRange, page, limit] as const,
    detail: (id: string) => ["servicePricing", "detail", id] as const,
  },

  staffMember: {
    all: ["staffMember"] as const,
    lists: () => ["staffMember", "list"] as const,
    listParams: (limit?: number, page?: number) =>
      ["staffMember", "list", limit, page] as const,
    detail: (id: string) => ["staffMember", "detail", id] as const,
  },

  crewMember: {
    all: ["crewMember"] as const,
    lists: () => ["crewMember", "list"] as const,
    listParams: (limit?: number, page?: number) =>
      ["crewMember", "list", limit, page] as const,
    detail: (id: string) => ["crewMember", "detail", id] as const,
  },

  testimonial: {
    all: ["testimonial"] as const,
    lists: () => ["testimonial", "list"] as const,
    listParams: (page?: number, limit?: number) =>
      ["testimonial", "list", page, limit] as const,
    detail: (id: string) => ["testimonial", "detail", id] as const,
  },

  news: {
    all: ["news"] as const,
    lists: () => ["news", "list"] as const,
    listParams: (page?: number, limit?: number) =>
      ["news", "list", page, limit] as const,
    detail: (id: string) => ["news", "detail", id] as const,
  },

  faq: {
    all: ["faq"] as const,
    lists: () => ["faq", "list"] as const,
    listParams: (page?: number, limit?: number) =>
      ["faq", "list", page, limit] as const,
    detail: (id: string) => ["faq", "detail", id] as const,
  },

  ipWhiteList: {
    all: ["ipWhiteList"] as const,
    lists: () => ["ipWhiteList", "list"] as const,
    listParams: (page?: number, limit?: number) =>
      ["ipWhiteList", "list", page, limit] as const,
    detail: (id: string) => ["ipWhiteList", "detail", id] as const,
  },

  trip: {
    all: ["trip"] as const,
    lists: () => ["trip", "list"] as const,
    listParams: (status?: string, page?: number, limit?: number) =>
      ["trip", "list", status, page, limit] as const,
    detail: (id: string) => ["trip", "detail", id] as const,
  },

  contentBlock: {
    all: ["contentBlock"] as const,
    lists: () => ["contentBlock", "list"] as const,
    listParams: (data?: { limit?: number; page?: number }) =>
      ["contentBlock", "list", data] as const,
    detail: (id: string) => ["contentBlock", "detail", id] as const,
    tabs: () => ["contentBlock", "tabs"] as const,
  },

  payment: {
    all: ["payment"] as const,
    lists: () => ["payment", "list"] as const,
    listParams: (limit?: number, page?: number, status?: string) =>
      ["payment", "list", limit, page, status] as const,
    detail: (id: string) => ["payment", "detail", id] as const,
  },

  refund: {
    all: ["refund"] as const,
    lists: () => ["refund", "list"] as const,
    listParams: (limit?: number, page?: number) =>
      ["refund", "list", limit, page] as const,
  },

  servicePageContent: {
    all: ["servicePageContent"] as const,
    lists: () => ["servicePageContent", "list"] as const,
    listParams: (params?: unknown) =>
      ["servicePageContent", "list", params] as const,
    detail: (id: string) => ["servicePageContent", "detail", id] as const,
  },

  destinationPageContent: {
    all: ["destinationPageContent"] as const,
    lists: () => ["destinationPageContent", "list"] as const,
    listParams: (params?: unknown) =>
      ["destinationPageContent", "list", params] as const,
    detail: (id: string) => ["destinationPageContent", "detail", id] as const,
  },

  tag: {
    all: ["tag"] as const,
    lists: () => ["tag", "list"] as const,
    listParams: (params?: unknown, page?: number) =>
      ["tag", "list", params, page] as const,
    detail: (id: string) => ["tag", "detail", id] as const,
  },

  metaKeyword: {
    all: ["metaKeyword"] as const,
    lists: () => ["metaKeyword", "list"] as const,
    listParams: (params?: unknown, page?: number) =>
      ["metaKeyword", "list", params, page] as const,
    detail: (id: string) => ["metaKeyword", "detail", id] as const,
  },

  media: {
    all: ["media"] as const,
    lists: () => ["media", "list"] as const,
    detail: (id: string) => ["media", "detail", id] as const,
  },

  notification: {
    all: ["notification"] as const,
    lists: () => ["notification", "list"] as const,
    listParams: (
      userId?: string,
      limit?: number,
      skip?: number,
      filters?: string,
    ) => ["notification", "list", userId, limit, skip, filters] as const,
    detail: (id: string) => ["notification", "detail", id] as const,
  },

  supportTicket: {
    all: ["supportTicket"] as const,
    lists: () => ["supportTicket", "list"] as const,
    listParams: (
      page?: number,
      limit?: number,
      status?: string,
      type?: string,
    ) => ["supportTicket", "list", page, limit, status, type] as const,
    detail: (id: string) => ["supportTicket", "detail", id] as const,
  },

  auditLog: {
    all: ["auditLog"] as const,
    lists: () => ["auditLog", "list"] as const,
    listParams: (page?: number, limit?: number) =>
      ["auditLog", "list", page, limit] as const,
    detail: (id: string) => ["auditLog", "detail", id] as const,
  },

  report: {
    all: ["report"] as const,
    lists: () => ["report", "list"] as const,
    listParams: (limit?: number, page?: number) =>
      ["report", "list", limit, page] as const,
  },

  globalSearch: {
    all: ["globalSearch"] as const,
    search: (q: string) => ["globalSearch", q] as const,
  },

  auth: {
    permissions: (data?: unknown) => ["auth", "permissions", data] as const,
    roles: () => ["auth", "roles"] as const,
    dashboard: (start?: string, end?: string, page?: number) =>
      ["auth", "dashboard", start, end, page] as const,
  },

  userPermission: {
    /** Prefix to invalidate all user permission queries (e.g. after sync region permissions to users) */
    allPrefix: ["userPermission"] as const,
    all: (userId: string) => ["userPermission", userId] as const,
    permissions: () => ["userPermission", "permissions"] as const,
  },

  regionPermission: {
    all: (regionId: string) => ["regionPermission", regionId] as const,
  },

  siteSetting: {
    all: ["siteSetting"] as const,
    partnerLists: (
      dateRange?: unknown,
      page?: number,
      limit?: number,
      status?: string,
    ) =>
      [
        "siteSetting",
        "partner",
        "list",
        dateRange,
        page,
        limit,
        status,
      ] as const,
    partnerDetail: (id: string) =>
      ["siteSetting", "partner", "detail", id] as const,
    ui: () => ["siteSetting", "ui"] as const,
  },

  partnerTransaction: {
    all: ["partnerTransaction"] as const,
    lists: (page?: number, limit?: number) =>
      ["partnerTransaction", "list", page, limit] as const,
  },

  homePage: {
    all: ["homePage"] as const,
    lists: (params?: unknown) => ["homePage", "list", params] as const,
    detail: (id: string) => ["homePage", "detail", id] as const,
  },

  chauffeurPage: {
    all: ["chauffeurPage"] as const,
    lists: (params?: unknown) => ["chauffeurPage", "list", params] as const,
    detail: (id: string) => ["chauffeurPage", "detail", id] as const,
  },

  routesPage: {
    all: ["routesPage"] as const,
    lists: (params?: unknown) => ["routesPage", "list", params] as const,
    detail: (id: string) => ["routesPage", "detail", id] as const,
  },

  countryPage: {
    all: ["countryPage"] as const,
    lists: (params?: unknown) => ["countryPage", "list", params] as const,
    detail: (id: string) => ["countryPage", "detail", id] as const,
  },

  businessPageLayout: {
    all: ["businessPageLayout"] as const,
    lists: (params?: unknown) =>
      ["businessPageLayout", "list", params] as const,
    detail: (id: string) => ["businessPageLayout", "detail", id] as const,
  },

  contact: {
    all: ["contact"] as const,
    lists: (page?: number, limit?: number) =>
      ["contact", "list", page, limit] as const,
    detail: (id: string) => ["contact", "detail", id] as const,
  },

  bookingPassengerUser: {
    detail: (userId: string | undefined) =>
      ["bookingPassengerUser", userId] as const,
  },

  cmsFaq: {
    content: () => ["cmsFaq", "content"] as const,
    listParams: (page?: number, limit?: number) =>
      ["cmsFaq", "list", page, limit] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
