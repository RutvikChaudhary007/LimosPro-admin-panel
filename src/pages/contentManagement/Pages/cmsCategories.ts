/**
 * CMS Page Categories Configuration
 *
 * This file provides a centralized mapping between:
 * - Display names (shown in UI) → "Business & Diplomats Hub"
 * - URL keys (used in routing) → "diplomats"
 * - Count keys (used for filtering counts) → "diplomats"
 *
 * This ensures consistency and prevents %20 encoding issues in URLs.
 */

export type CMSCategoryKey =
  | "business"
  | "home"
  | "services"
  | "destinations"
  | "about"
  | "chauffeur"
  | "help"
  | "cityroutes"
  | "countries"
  | "cities"
  | "diplomats"
  | "country"
  | "routedetails";

export type CMSCategoryConfig = {
  key: CMSCategoryKey; // URL-safe key for routing
  label: string; // Display label in UI
  apiFilterKey: string; // Key used for API filtering
  countKey: string; // Key used for count lookups
  name: string; // Name used for category selection
};

/**
 * Complete category configuration with display labels and keys.
 */
export const CMS_CATEGORIES: CMSCategoryConfig[] = [
  {
    key: "business",
    label: "Business & Diplomats",
    apiFilterKey: "business",
    countKey: "business",
    name: "Business",
  },
  {
    key: "home",
    label: "Home",
    apiFilterKey: "home",
    countKey: "home",
    name: "Home",
  },
  {
    key: "services",
    label: "Services",
    apiFilterKey: "service",
    countKey: "service",
    name: "Services",
  },
  {
    key: "destinations",
    label: "Global Cities & Airports",
    apiFilterKey: "destination",
    countKey: "destination",
    name: "Destinations",
  },
  {
    key: "about",
    label: "About",
    apiFilterKey: "about",
    countKey: "about",
    name: "about",
  },
  {
    key: "chauffeur",
    label: "Chauffeur",
    apiFilterKey: "chauffeur",
    countKey: "chauffeur",
    name: "Chauffeur",
  },
  {
    key: "help",
    label: "Help",
    apiFilterKey: "help",
    countKey: "help",
    name: "help",
  },
  {
    key: "cityroutes",
    label: "City-to-City Routes",
    apiFilterKey: "cityroutes",
    countKey: "cityroutes",
    name: "City-to-City Routes",
  },
  {
    key: "countries",
    label: "Countries Hub",
    apiFilterKey: "countries",
    countKey: "countries",
    name: "Countries",
  },
  {
    key: "cities",
    label: "Global Cities & Airports Hub",
    apiFilterKey: "cities",
    countKey: "cities",
    name: "Cities",
  },
  {
    key: "diplomats",
    label: "Business & Diplomats Hub",
    apiFilterKey: "diplomats-hub",
    countKey: "diplomats",
    name: "Business & Diplomats Hub",
  },
  {
    key: "country",
    label: "Country Detail",
    apiFilterKey: "country",
    countKey: "country",
    name: "Country Detail",
  },
  {
    key: "routedetails",
    label: "Route Details",
    apiFilterKey: "routedetails",
    countKey: "routedetails",
    name: "routedetails",
  },
];

/**
 * Mapping from display label → URL-safe category key.
 * Use this when navigating from UI labels to routes.
 */
export const LABEL_TO_KEY: Record<string, CMSCategoryKey> =
  CMS_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.label] = cat.key;
      return acc;
    },
    {} as Record<string, CMSCategoryKey>,
  );

/**
 * Mapping from name → category config.
 * Use this for category selection in the sidebar.
 */
export const NAME_TO_CONFIG: Record<string, CMSCategoryConfig> =
  CMS_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.name] = cat;
      return acc;
    },
    {} as Record<string, CMSCategoryConfig>,
  );

/**
 * Mapping from URL key → category config.
 * Use this in CMSCategoryRouter to look up components.
 */
export const KEY_TO_CONFIG: Record<CMSCategoryKey, CMSCategoryConfig> =
  CMS_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.key] = cat;
      return acc;
    },
    {} as Record<CMSCategoryKey, CMSCategoryConfig>,
  );

/**
 * Convert a display label to a URL-safe category key.
 * Falls back to lowercase if no mapping found.
 */
export function getCategoryKey(label: string): CMSCategoryKey | null {
  return LABEL_TO_KEY[label] ?? null;
}

/**
 * Convert a category name to a URL-safe category key.
 */
export function getCategoryKeyFromName(name: string): CMSCategoryKey | null {
  const config = NAME_TO_CONFIG[name];
  return config?.key ?? null;
}

/**
 * Get all unique category keys for routing.
 */
export function getAllCategoryKeys(): CMSCategoryKey[] {
  return CMS_CATEGORIES.map((cat) => cat.key);
}

/**
 * Get category config by name.
 */
export function getCategoryConfigByName(
  name: string,
): CMSCategoryConfig | null {
  return NAME_TO_CONFIG[name] ?? null;
}
