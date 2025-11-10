/**
 * Initializes Google Places Autocomplete on an input element
 */
interface AddressFields {
  address: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  location?: {
    latitude: number | null;
    longitude: number | null;
  };
}
export const initializeGooglePlacesAutocomplete = (
  inputRef: React.RefObject<HTMLInputElement>,
  onAddressSelected: (address: string, updateAddress: object) => void,
  handleUpdate: (update: Partial<AddressFields>, formatted: string) => void,
): google.maps.places.Autocomplete | null => {
  if (!inputRef.current) return null;

  try {
    console.log("Initializing Google Places Autocomplete");
    // const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();
    // console.log("placeAutocomplete:>",placeAutocomplete)
    // autocompleteRef.current.appendChild(placeAutocomplete);
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: ["us"] },
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"],
    });
    autocomplete.addListener("place_changed", () => {
      // console.log("place:",autocomplete.getPlace());
      const place = autocomplete.getPlace();
      // console.log("lat:", place.geometry?.location?.lat());
      // console.log("lng:", place.geometry?.location?.lng());

      if (place && place.formatted_address) {
        // console.log('Address selected:', place.formatted_address);
        const addressObject: AddressFields = {
          address: "",
        };
        let streetNumber = "";
        let route = "";
        let address2 = "";
        // 1. Build the structured update object
        const update: Partial<AddressFields> = {
          address: "",
          // address2: "",
          city: "",
          state: "",
          country: "",
          zip: "",
        };

        // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
        place.address_components.forEach((component) => {
          const types = component.types;

          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (types.includes("subpremise")) {
            address2 = component.long_name;
            update.address2 = component.long_name;
          } else if (types.includes("route")) {
            route = component.long_name;
          } else if (types.includes("locality")) {
            addressObject.city = component.long_name;
            update.city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            addressObject.state = component.short_name;
            update.state = component.short_name;
          } else if (types.includes("country")) {
            addressObject.country = component.short_name;
            update.country = component.short_name;
          } else if (types.includes("postal_code")) {
            addressObject.zip = component.long_name;
            update.zip = component.long_name;
          }
        });

        if (streetNumber && route && address2) {
          addressObject.address = `${streetNumber} ${route} ${address2}`;
        } else if (route && streetNumber) {
          addressObject.address = `${streetNumber} ${route}`;
        } else if (streetNumber) {
          addressObject.address = `${streetNumber} `;
        }

        if (place.geometry) {
          update.location = {
            latitude: place?.geometry?.location?.lat() ?? null,
            longitude: place?.geometry?.location?.lng() ?? null,
          };
          addressObject.location = {
            latitude: place?.geometry?.location?.lat() ?? null,
            longitude: place?.geometry?.location?.lng() ?? null,
          };
        }

        // console.log(`addressObject:${JSON.stringify(addressObject)}`)
        onAddressSelected(place.formatted_address, addressObject);
        // 2. Combine street components
        update.address = addressObject.address;

        // 3. Call handleUpdate to apply to form state and propagate upward
        handleUpdate(update, place.formatted_address);
      } else {
        console.log("No address selected or invalid address");
        onAddressSelected("", {});
      }
    });

    return autocomplete;
  } catch (error) {
    console.error("Error initializing Google Places Autocomplete:", error);
    return null;
  }
};

export const geoDecoding = ({ lat, lng }: { lat: string; lng: string }) => {
  return new Promise((resolve, reject) => {
    if (!(window.google && window.google.maps && window.google.maps.Geocoder)) {
      reject("Google Maps API not loaded");
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    geocoder.geocode({ location: latlng }, (results, status) => {
      console.log("results:>", results);
      if (status === "OK" && results && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(status === "OK" ? "No address results" : `Geocoder failed due to: ${status}`);
      }
    });
  });
};
