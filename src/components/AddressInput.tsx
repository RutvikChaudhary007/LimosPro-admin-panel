//@ts-nocheck
import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { AlertCircle, Building2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { toast } from "sonner";
// import { Toaster} from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { env } from "@/utils/env";
import { initializeGooglePlacesAutocomplete } from "@/utils/googleMaps";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

type TLocation = {
  latitude: number | null;
  longitude: number | null;
};
interface AddressFields {
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  location: TLocation;
}

interface AddressInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | TLocation;
  field: ControllerRenderProps<T, Path<T>>;
  onChange: (value: string) => void;
  onUpdate: (update: IAddressObj) => void;
  onValidityChange?: (isValid: boolean) => void;
}

const libraries = ["places", "geocoding"];

function isLatLngObject(
  value: any,
): value is { latitude: number; longitude: number } {
  return (
    value &&
    typeof value === "object" &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  );
}
const AddressInput = <T extends FieldValues>({
  value,
  onChange,
  onUpdate,
  onValidityChange,
  field,
  ...props
}: AddressInputProps<T>) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef<AddressFields | null>(null);
  const onChangeRef = useRef(onChange);
  const onUpdateRef = useRef(onUpdate);
  const onValidityChangeRef = useRef(onValidityChange);
  const [googleMapsApiKey] = useState<string | null>(env.VITE_GOOGLE_MAP_KEY);
  const [addressAPIError] = useState<string | null>(null);
  const [fields, setFields] = useState<AddressFields>({
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    location: {
      latitude: null,
      longitude: null,
    },
  });

  // Keep refs fresh without re-initializing Autocomplete (which is expensive and can freeze typing).
  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  useEffect(() => {
    onValidityChangeRef.current = onValidityChange;
  }, [onValidityChange]);

  // // Update parent when fields change
  // useEffect(() => {
  //   const hasContent = Object.values(fields).some((field) => {
  //     if (typeof field === "object") {
  //       return field;
  //     }
  //     return field.trim().length > 0;
  //   });
  //   const formattedAddress = hasContent
  //     ? `${fields.address}${fields.address && fields.city ? ", " : ""}${fields.city}${(fields.address || fields.city) && fields.state ? ", " : ""}${fields.state}${(fields.address || fields.city || fields.state) && fields.zip ? ", " : ""}${fields.zip}${(fields.address || fields.city || fields.state || fields.zip) && fields.country ? ", " : ""}${fields.country}`
  //     : "";
  //   onChange(formattedAddress);
  //   // onUpdate(fields);

  //   // Check if all required fields are filled
  //   const isValid =
  //     !!fields.address &&
  //     !!fields.city &&
  //     !!fields.state &&
  //     !!fields.zip &&
  //     !!fields.country;
  //   // onValidityChange(isValid);
  // }, [fields, onChange]);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });

  // Initialize Places Autocomplete
  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;

    if (isLoaded && addressInputRef.current && !loadError) {
      autocomplete = initializeGooglePlacesAutocomplete(
        addressInputRef,
        (address: string, updateAddress: object) => {
          onChangeRef.current(address);
          onUpdateRef.current(updateAddress as any);
        },
        (update: Partial<AddressFields>, formatted: string) => {
          const base = fieldsRef.current ?? fields;
          const merged = { ...base, ...update };

          // We primarily need a *selectable location* (formatted string + geometry).
          // Some valid selections (e.g. city/region) won't include street/zip, so we should not block updates.
          const isFullAddress =
            !!merged.address?.trim() &&
            !!merged.city?.trim() &&
            !!merged.state?.trim() &&
            !!merged.zip?.trim() &&
            !!merged.country?.trim();

          if (!isFullAddress) {
            toast.message(
              "Tip: for best results, select a full street address from suggestions.",
            );
          }

          setFields(merged);
          onValidityChangeRef.current?.(isFullAddress);
        },
      );
    }

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
    // Intentionally exclude `fields` and callbacks to avoid re-initializing Autocomplete on every keystroke.
  }, [isLoaded, loadError]);

  useEffect(() => {
    let isMounted = true;

    // CASE 1: value is a STRING → directly update the field
    if (typeof value === "string") {
      setFields((prev) => ({
        ...prev,
        address: value,
      }));
      return;
    }

    // CASE 2: value is a LAT/LNG object → reverse geocode
    if (isLatLngObject(value) && isLoaded && !loadError) {
      const fetchDecoded = async () => {
        try {
          const address = await geoDecoding({
            lat: value.latitude,
            lng: value.longitude,
          });
          console.log("isLatLng address:", address);

          if (isMounted && address) {
            // Update text field
            onChange(address); // this sends formatted string to parent

            setFields((prev) => ({
              ...prev,
              address: address,
            }));
            // Update all fields
            // setFields({
            //   address: address.street || "",
            //   city: address.city || "",
            //   state: address.state || "",
            //   country: address.country || "",
            //   zip: address.zip || "",
            //   location: {
            //     latitude: value.latitude,
            //     longitude: value.longitude,
            //   },
            // });

            // Notify parent with full object
            onUpdate({
              location: address,
            });
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      };

      fetchDecoded();
    }

    return () => {
      isMounted = false;
    };
  }, [value, isLoaded, loadError]);

  if (loadError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="size-4" />
        <AlertTitle>Google Maps Error</AlertTitle>
        <AlertDescription>
          There was a problem loading Google Maps: {loadError.message}
          <br />
          Please try refreshing the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (addressAPIError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="size-4" />
        <AlertTitle>Address API Error</AlertTitle>
        <AlertDescription>
          {addressAPIError}
          <br />
          Please try refreshing the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        value={value}
        onKeyDown={(e) => {
          // Prevent Google Places selection (Enter) from submitting the parent <form>.
          if (e.key === "Enter") {
            e.preventDefault();
          }
          props.onKeyDown?.(e);
        }}
        onChange={(e) => {
          // Single authoritative change path:
          // parent `onChange` must update RHF (typically via `setValue(..., { shouldValidate: true })`)
          onChange(e.target.value);
        }}
        ref={(el) => {
          field.ref(el); // Keep RHF ref
          addressInputRef.current = el; // Keep autocomplete ref
        }}
      />
      <InputGroupAddon>
        <Building2Icon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default AddressInput;
