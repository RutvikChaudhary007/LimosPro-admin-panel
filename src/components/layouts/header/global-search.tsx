import { IconX } from "@tabler/icons-react";
import { Car, FileText, Phone, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchGlobalSearch } from "@/api";
import IconSearch from "@/assets/Icons/ic-search.svg?react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/useDebounce";
import { usePermission } from "@/hooks/usePermission";
import { constant } from "@/lib/constant";

/** Map search result type to sidebar permission (view). Must match app-sidebar.tsx */
const TYPE_PERMISSION: Record<string, string | string[]> = {
  Booking: "manageBookings",
  Chauffeur: ["manageChauffeurs", "managePartnerChauffeurs"],
  Fleet: "manageFleets",
  Customer: "manageUsers",
  Partner: "managePartners",
  Staff: "manageStaffMembers",
  "Regional Admin": "manageRegionAdmins",
  Payment: "managePayments",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Booking: <FileText className="size-5" />,
  Chauffeur: <User className="size-5" />,
  Fleet: <Car className="size-5" />,
  Customer: <Users className="size-5" />,
  Partner: <Phone className="size-5" />,
  Staff: <User className="size-5" />,
  "Regional Admin": <User className="size-5" />,
  News: <FileText className="size-5" />,
  Blog: <FileText className="size-5" />,
  FAQ: <FileText className="size-5" />,
  Testimonial: <FileText className="size-5" />,
  Payment: <FileText className="size-5" />,
};

/** Build redirect path for a search result. Returns "" if route is invalid or user should not navigate. */
function getRedirectPath(
  type: string,
  item: { id?: string; type?: string; subType?: string },
  hasPermission: (name: string | string[], action?: string) => boolean,
): string {
  const id = item.id != null ? String(item.id).trim() : "";
  const perm = TYPE_PERMISSION[type];
  if (perm && !hasPermission(perm, "view")) return "";

  switch (type) {
    case "Booking":
      return id ? constant.ROUTING_URLS.VIEW_BOOKING.replace(":id", id) : "";
    case "Chauffeur":
      return id ? constant.ROUTING_URLS.VIEW_CHAUFFEUR.replace(":id", id) : "";
    case "Fleet":
      return id ? constant.ROUTING_URLS.VIEW_FLEET.replace(":id", id) : "";
    case "Customer":
      return id ? constant.ROUTING_URLS.VIEW_USERS.replace(":id", id) : "";
    case "Partner":
      // Backend now returns Partner.id for both Company and User Profile; view page uses partner id
      return id
        ? constant.ROUTING_URLS.VIEW_PARTNER.replace(":id", id)
        : constant.ROUTING_URLS.PARTNER;
    case "Staff":
      return constant.ROUTING_URLS.STAFF_MEMBERS;
    case "Regional Admin":
      return constant.ROUTING_URLS.REGION_ADMIN;
    case "Payment":
      return id ? constant.ROUTING_URLS.VIEW_PAYMENTS.replace(":id", id) : "";
    default: {
      const listRoutes: Record<string, string> = {
        News: constant.ROUTING_URLS.NEWS,
        Blog: constant.ROUTING_URLS.BLOG_POSTS,
        FAQ: constant.ROUTING_URLS.FAQ,
        Testimonial: constant.ROUTING_URLS.TESTIMONIALS,
      };
      return listRoutes[type] || "";
    }
  }
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300); // Reduced from 500ms to 300ms
  const isTyping = query !== debouncedQuery && query.length > 0;

  const {
    data: searchResults,
    isFetching,
    error,
  } = useFetchGlobalSearch({
    search: debouncedQuery,
    enabled: isFocused && query.length > 0,
  });

  // GROUP RESULTS BY TYPE
  const groups = (searchResults || []).reduce((acc: any, item: any) => {
    const type = item.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const hasResults = Object.keys(groups).length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-[400px]" ref={wrapperRef}>
      <InputGroup>
        <InputGroupInput
          placeholder="Search for Bookings, Fleets, Chauffeurs..."
          value={query}
          onFocus={() => {
            setIsFocused(true);
            if (query.length > 0) setShow(true);
          }}
          onBlur={() => {
            // Delay blur slightly to allow clicking results
            setTimeout(() => setIsFocused(false), 200);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
          }}
        />

        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        {(query.length > 0 || isFetching || isTyping) && (
          <InputGroupAddon align="inline-end">
            {isFetching || isTyping ? (
              <div className="size-4 animate-spin rounded-full border-2 border-base-gray border-t-transparent" />
            ) : (
              <IconX
                className="hover:text-base-danger cursor-pointer transition-colors"
                onClick={() => {
                  setQuery("");
                  setShow(false);
                }}
              />
            )}
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Dropdown with Keyboard Navigation */}
      {show && debouncedQuery.length > 0 && (
        <div className="font-quicksand absolute mt-2 w-full bg-base-white shadow-sm rounded border border-base-gray z-20 max-h-80 scroll-area overflow-hidden">
          <Command className="bg-transparent" shouldFilter={false}>
            <CommandList className="max-h-80 scroll-area">
              {error ? (
                <div className="px-4 py-6 font-medium text-base text-center text-red-600">
                  Search unavailable. Please try again.
                </div>
              ) : !hasResults && !isFetching ? (
                <div className="px-4 py-6 font-medium text-base text-center text-base-black">
                  No results found
                </div>
              ) : (
                <>
                  {Object.keys(groups).map((type) => (
                    <CommandGroup
                      key={type}
                      heading={type}
                      className="overflow-hidden [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-base-gray [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:bg-base-light-gray/30"
                    >
                      {groups[type].map((item: any, idx: number) => (
                        <CommandItem
                          key={item.id ?? `${type}-${idx}`}
                          value={String(item.id ?? `${type}-${idx}`)}
                          onSelect={() => {
                            const path = getRedirectPath(
                              type,
                              item,
                              hasPermission,
                            );
                            if (path) {
                              navigate(path);
                              setShow(false);
                              setQuery("");
                            }
                          }}
                          className="flex items-center gap-4 cursor-pointer transition-all duration-200 font-medium text-base text-base-black [&_svg]:text-base-gray aria-selected:[&_svg]:text-base-primary aria-selected:bg-base-light-gray px-3 py-2"
                        >
                          {TYPE_ICONS[type] || <FileText className="size-5" />}
                          <span className="flex-1 truncate">
                            {item.name || item.title || item.label}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                  {(isFetching || isTyping) && (
                    <div className="px-4 py-3 text-sm text-center text-base-gray border-t border-base-gray/10">
                      Searching...
                    </div>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
