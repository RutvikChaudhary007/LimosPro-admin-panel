export const constant = {
  ROUTING_URLS: {
    // Admin URLS
    ADMIN_LOGIN: "/auth/login",

    // Dashboard URLS
    DASHBOARD: "/dashboard",

    // Region Management URLs
    REGION: "/region-management/regions",
    CREATE_REGION: "/region-management/regions/create",
    EDIT_REGION: "/region-management/regions/:id/edit",

    // Regional Admin Management URLs
    REGION_ADMIN: "/region-management/regional-admins",
    CREATE_REGION_ADMIN: "/region-management/regional-admins/create",
    EDIT_REGION_ADMIN: "/region-management/regional-admins/:id/edit",

    // Affiliate URLS
    AFFILIATE: "/affiliate",
    CREATE_AFFILIATE: "/affiliate/create",
    EDIT_AFFILIATE: "/affiliate/:id/edit",
    VIEW_AFFILIATE: "/affiliate/:id",

    // Chauffeur URLS
    CHAUFFEUR: "/chauffeur",
    CREATE_CHAUFFEUR: "/chauffeur/create",
    EDIT_CHAUFFEUR: "/chauffeur/:id/edit",
    VIEW_CHAUFFEUR: "/chauffeur/:id",

    // Booking URLS
    BOOKING: "/bookings",
    CREATE_BOOKING: "/bookings/create",
    VIEW_BOOKING: "/bookings/:id",

    // Users URLS
    USERS: "/users",
    CREATE_USERS: "/users/create",
    EDIT_USERS: "/users/:id/edit",
    VIEW_USERS: "/users/:id",

    // Fleets URLS
    FLEETS: "/fleets",
    CREATE_FLEET: "/fleets/create",
    EDIT_FLEET: "/fleets/:id/edit",
    VIEW_FLEET: "/fleets/:id",

    // Trips URLS
    TRIPS: "/trips",
    TRIPS_MAP: "/trips/map/:id",
    VIEW_TRIPS: "/trips/:id",

    // Payments URLS
    PAYMENTS: "/payments",
    VIEW_PAYMENTS: "/payments/:id",
    REFUND_REQUEST: "/payments/refund_request",

    // REFUND URLS
    REFUND: "/refund",
    VIEW_REFUND: "/refund/:id",

    // Reports URLS
    REPORTS: "/reports",

    // Content Management Blog URLs
    BLOG_POSTS: "/content-management/blog",
    CREATE_BLOG_POST: "/content-management/blog/create",
    EDIT_BLOG_POST: "/content-management/blog/:id/edit",
    VIEW_BLOG_POST: "/content-management/blog/:id",

    // Content Management URLS
    CONTENT_MANAGEMENT_ALL_PAGES: "/content-management/pages",
    CREATE_CONTENT_MANAGEMENT: "/content-management/pages/create",
    EDIT_CONTENT_MANAGEMENT: "/content-management/pages/:id/edit",
    PAGE_PREVIEW: "/content-management/pages/:id/preview",

    // Content Management SEO URLs
    SEO: "/content-management/seo",
    CREATE_SEO: "/content-management/seo/create",
    EDIT_SEO: "/content-management/seo/:id/edit",

    // Crew URLS
    CREW_MEMBERS: "/crew-members",
    CREATE_CREW_MEMBERS: "/crew-members/create",
    EDIT_CREW_MEMBERS: "/crew-members/:id/edit",
    VIEW_CREW_MEMBERS: "/crew-members/:id",

    // Staff URLS
    STAFF_MEMBERS: "/staff-members",
    CREATE_STAFF_MEMBERS: "/staff-members/create",
    EDIT_STAFF_MEMBERS: "/staff-members/:id/edit",

    // Contact URLS
    CONTACT_REQUESTS: "/contact-requests",

    // Testimonial URLS
    TESTIMONIALS: "/testimonials",
    CREATE_TESTIMONIALS: "/testimonials/create",
    EDIT_TESTIMONIALS: "/testimonials/:id/edit",

    // News URLS
    NEWS: "/news",
    CREATE_NEWS: "/news/create",
    EDIT_NEWS: "/news/:id/edit",

    // FAQ URLS
    FAQ: "/faq",
    CREATE_FAQ: "/faq/create",
    EDIT_FAQ: "/faq/:id/edit",

    // IP WHITE LIST URLS
    IP_WHITE_LIST: "/ip-white-list",
    CREATE_IP_WHITE_LIST: "/ip-white-list/create",
    EDIT_IP_WHITE_LIST: "/ip-white-list/:id/edit",

    // PARTNERS URLS
    OUR_PARTNERS: "/our-partners",
    CREATE_OUR_PARTNERS: "/our-partners/create",
    EDIT_OUR_PARTNERS: "/our-partners/:id/edit",

    // SETTINGS URLS
    SETTINGS: "/settings",

    // NOTIFICATION URLS
    NOTIFICATION: "/notifications",
    VIEW_NOTIFICATION: "/notifications:/id",
  },
  EDITOR_FORMATS: {
    modules: {
      syntax: true, // highlight.js needed!
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
          [{ size: ["small", false, "large", "huge"] }],

          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],

          [{ align: [] }, { direction: "rtl" }],

          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],

          [{ color: [] }, { background: [] }],

          [{ script: "sub" }, { script: "super" }],

          ["link", "image", "video"],

          // ["emoji"],  ❌ ONLY if emoji module installed

          ["clean"],
          ["undo", "redo"],
        ],
      },
    },

    formats: [
      "header",
      "font",
      "size",

      "bold",
      "italic",
      "underline",
      "strike",

      "blockquote",
      "code-block",

      "align",
      "direction",

      "list", // bullet + ordered handled internally
      "indent",

      "color",
      "background",

      "script",

      "link",
      "image",
      "video",

      "table", // only works if you installed quill-table
    ],
  },
};
