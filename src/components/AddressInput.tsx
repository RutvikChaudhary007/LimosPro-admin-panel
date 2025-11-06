//@ts-nocheck

import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import { Toaster} from "@/hooks/use-toast";
import type { ControllerRenderProps } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { env } from "@/utils/env";
import { initializeGooglePlacesAutocomplete } from "@/utils/googleMaps";

interface AddressFields {
	address: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	location: {
		latitude: number | null;
		longitude: number | null;
	};
}

interface AddressInputProps {
	value: string;
	field: ControllerRenderProps;
	onChange: (value: string) => void;
	onUpdate: (address: object) => void;
	onValidityChange: (isValid: boolean) => void;
}

const libraries = ["places", "geocoding"];

const AddressInput = ({
	value,
	onChange,
	onUpdate,
	onValidityChange,
	field,
	...props
}: AddressInputProps) => {
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
	const [setIsManualInput] = useState(false);

	// Update parent when fields change
	useEffect(() => {
		const hasContent = Object.values(fields).some((field) => {
			if (typeof field === "object") {
				return field;
			}
			return field.trim().length > 0;
		});
		const formattedAddress = hasContent
			? `${fields.address}${fields.address && fields.city ? ", " : ""}${fields.city}${(fields.address || fields.city) && fields.state ? ", " : ""}${fields.state}${(fields.address || fields.city || fields.state) && fields.zip ? ", " : ""}${fields.zip}${(fields.address || fields.city || fields.state || fields.zip) && fields.country ? ", " : ""}${fields.country}`
			: "";
		onChange(formattedAddress);
		// onUpdate(fields);

		// Check if all required fields are filled
		const isValid =
			!!fields.address &&
			!!fields.city &&
			!!fields.state &&
			!!fields.zip &&
			!!fields.country;
		onValidityChange(isValid);
	}, [fields]);

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
					setIsManualInput(false);
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
						Toaster({
							title: "Incomplete address",
							description:
								"Please provide a full address with street number, route name, city, state, zip, and country.",
						});
						onValidityChange(false);
						return;
					}

					setFields(merged);

					onChange(formatted);
					onValidityChange(true);
					setIsManualInput(false);
				},
			);
		}

		return () => {
			if (autocomplete) {
				google.maps.event.clearInstanceListeners(autocomplete);
			}
		};
	}, [isLoaded, loadError]);

	const handleManualFieldChange = (
		field: keyof AddressFields,
		value: string,
	) => {
		setFields((prev) => ({ ...prev, [field]: value }));
		setIsManualInput(true);
	};

	if (loadError) {
		return (
			<Alert variant="destructive" className="mb-6">
				<AlertCircle className="h-4 w-4" />
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
				<AlertCircle className="h-4 w-4" />
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
		<Input
			{...field}
			{...props}
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
				setIsManualInput(true);
			}}
			ref={addressInputRef}
			className="pr-10 rounded placeholder:text-[#E6E6E6] font-medium"
			placeholder="Start typing your address..."
		/>
	);
};

export default AddressInput;
