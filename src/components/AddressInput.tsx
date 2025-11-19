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
          onChange(address);
          onUpdate(updateAddress);
        },
        (update: Partial<AddressFields>, formatted: string) => {
          const merged = { ...fields, ...update };

          const isValid =
            !!merged.address?.trim() &&
            !!merged.city?.trim() &&
            !!merged.state?.trim() &&
            !!merged.zip?.trim() &&
            !!merged.country?.trim();

          if (!isValid) {
            toast.error(
              "Please provide a full address with street number, route name, city, state, zip, and country.",
            );
            // onValidityChange(false);
            return;
          }

          setFields(merged);

          onChange(formatted);
          // onValidityChange(true);
        },
      );
    }

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, loadError, fields, onUpdate, onChange]);

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
        onChange={(e) => {
          field.onChange(e.target.value); // Update RHF
          onChange(e.target.value); // Update your parent
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
