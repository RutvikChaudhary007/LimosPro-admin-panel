import { IconX } from "@tabler/icons-react";
import { Car, FileText, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Mock data (replace with API later)
  const data = [
    {
      type: "Booking",
      label: "#BK1023 – Airport Pickup – John Doe",
      icon: <FileText className="size-5" />,
    },
    {
      type: "Booking",
      label: "#BK1024 – City Transfer – Amaan Shaikh",
      icon: <FileText className="size-5" />,
    },
    {
      type: "Chauffeur",
      label: "Imran Shaikh – Available",
      icon: <User className="size-5" />,
    },
    {
      type: "Chauffeur",
      label: "Zaid Patel – On Trip",
      icon: <User className="size-5" />,
    },
    {
      type: "Fleet",
      label: "Mercedes S-Class – MH04 1122",
      icon: <Car className="size-5" />,
    },
    {
      type: "Fleet",
      label: "BMW 7 Series – MH01 AX 2200",
      icon: <Car className="size-5" />,
    },
    {
      type: "Customer",
      label: "Sarah Ali – 9988223344",
      icon: <Phone className="size-5" />,
    },
    {
      type: "Partner",
      label: "John Samuel – 8877445522",
      icon: <Phone className="size-5" />,
    },
  ];

  // GROUP + FILTER MATCHING RESULTS
  const groups = data.reduce((acc: any, item) => {
    if (item.label.toLowerCase().includes(query.toLowerCase())) {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
    }
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
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
          }}
        />

        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        {query.length > 0 && (
          <InputGroupAddon align="inline-end">
            <IconX
              className="hover:text-base-danger cursor-pointer transition-colors"
              onClick={() => {
                setQuery("");
                setShow(false);
              }}
            />
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Dropdown with Keyboard Navigation */}
      {show && query.length > 0 && (
        <div className="font-quicksand absolute mt-2 w-full bg-base-white shadow-sm rounded border border-base-gray z-20 max-h-80 scroll-area">
          <Command className="bg-transparent">
            <CommandList className="max-h-80 scroll-area">
              {!hasResults ? (
                <div className="px-4 py-6 font-medium text-base text-center text-base-black">
                  No results found
                </div>
              ) : (
                Object.keys(groups).map((type) => (
                  <CommandGroup
                    key={type}
                    heading={type}
                    className="overflow-hidden [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-base-gray [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest"
                  >
                    {groups[type].map((item: any, idx: number) => (
                      <CommandItem
                        key={idx}
                        value={`${type}-${idx}`}
                        onSelect={() => {
                          // Handle selection - navigate or perform action
                          setQuery(item.label);
                          console.log("Selected:", item.label);
                          setShow(false);
                        }}
                        className="flex items-center gap-4 cursor-pointer transition-all duration-200 font-medium text-base text-base-black [&_svg]:text-base-gray aria-selected:[&_svg]:text-base-primary aria-selected:bg-base-light-gray"
                      >
                        {item.icon}
                        <span className="flex-1 truncate">{item.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
