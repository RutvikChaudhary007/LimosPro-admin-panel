// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { format, getYear, setYear } from "date-fns";
import { CalendarIcon, Camera, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SelectValueContext } from "react-aria-components";
import { useForm } from "react-hook-form";
import z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { IFleetFormProps } from "@/types/fleet.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
	id: z.string().optional(),
	year: z.date(),
	// name: z.string().refine(value => value.trim() !== "", {
	//     message: "Fleet name cannot be empty or just whitespace.",
	// }).min(3, { message: "Fleet name must be at least 3 characters" }),
	description: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Description  cannot be empty or just whitespace.",
		})
		.min(3, { message: "Description  must be at least 3 characters" }),
	plateNumber: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Plate number  cannot be empty or just whitespace.",
		})
		.min(3, { message: "Plate number  must be at least 3 characters" }),
	brand: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Brand cannot be empty or just whitespace.",
		})
		.min(3, { message: "Brand must be at least 3 characters" }),
	extraTime: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "extra time cannot be empty or just whitespace.",
		})
		.min(3, { message: "Affiliate id must be at least 3 characters" }),
	regionId: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Affiliate id cannot be empty or just whitespace.",
		})
		.min(3, { message: "Affiliate id must be at least 3 characters" }),
	affiliateId: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Affiliate id cannot be empty or just whitespace.",
		})
		.min(3, { message: "Affiliate id must be at least 3 characters" }),
	// zonePricings: z.string().refine(value => value.trim() !== "", {
	//     message: "zonePricings id cannot be empty or just whitespace.",
	// }).min(3, { message: "Affiliate id must be at least 3 characters" }),
	model: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Model cannot be empty or just whitespace.",
		})
		.min(3, { message: "Model must be at least 3 characters" }),
	color: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Color cannot be empty or just whitespace.",
		})
		.min(3, { message: "Color must be at least 3 characters" }),
	cityToCityHourlyRate: z
		.string()
		.min(1, { message: "City to city hourly rate is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	capacity: z
		.string()
		.min(1, { message: "Capacity  is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	baseFair: z
		.string()
		.min(1, { message: "Base fair is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	minFair: z
		.string()
		.min(1, { message: "Min fair is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	minHour: z
		.string()
		.min(1, { message: "Min hour is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	pricePerMile: z
		.string()
		.min(1, { message: "Price per mile is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	pricePerHour: z
		.string()
		.min(1, { message: "Price per hour is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	pricePerMinute: z
		.string()
		.min(1, { message: "Price per minute is required" })
		.regex(/^\d+$/, { message: "Must be number" })
		.transform((v) => Number(v))
		.refine((n) => n >= 0, { message: "Must be non‑negative" }),
	vehicleType: z
		.string()
		.refine((value) => value.trim() !== "", {
			message: "Vehicle type  cannot be empty or just whitespace.",
		})
		.min(3, { message: "Vehicle type must be at least 3 characters" }),
	bagsCapacity: z.string().refine((value) => value.trim() !== "", {
		message: "Bags capacity  cannot be empty or just whitespace.",
	}),
	vehicleImages: z
		.custom<FileList>()
		.check((ctx) => {
			const list = ctx.value;
			if (list.length < 1) {
				ctx.issues.push({
					code: "custom",
					message: "Select at least 1 file",
					input: list,
				});
			}
			//   console.log("list:")
			if (list.length > 4) {
				ctx.issues.push({
					code: "custom",
					message: "You can upload up to 4 files",
					input: list,
				});
			}
		})
		.transform((list) => Array.from(list))
		.refine((files) => files.every((f) => f.size <= maxSize), {
			message: `Max size ${maxSize / (1024 * 1024)}MB`,
		})
		.refine(
			(files) => files.every((f) => ALLOWED_MIME_TYPES.includes(f.type)),
			{
				message: "Invalid file types detected",
			},
		),
	status: z.string().optional(),
});

export type TFleetForm = z.infer<typeof formSchema>;

const FleetOptions = [
	"Executive Sedan Fit for 3 Passengers",
	"Executive SUV Fit for 6 Passengers",
	"Business SUV Fit for 6 Passengers",
	"Executive VAN Fit for 10 Passengers",
	"Executive VAN Fit for 14 Passengers",
	"Executive Mini Bus 16 Passengers",
	"Executive Coach 40 Passenger",
];

const FleetForm = ({
	initialData,
	isAffiliateFetching,
	isRegionFetching,
	affiliateData,
	RegionData,
	onSubmit,
	disabledFields,
	type,
}: IFleetFormProps) => {
	const { toast } = useToast();
	//   console.log("affiliateData:", affiliateData);
	const [globalAirportLimit, setGlobalAirportLimit] = useState("65");
	const [zonePricing, setZonePricing] = useState([]);
	const [isZoneActive, setIsZoneActive] = useState(false);
	const [previews, setPreviews] = useState<string[]>([]);
	const [date, setDate] = useState(new Date());
	const years = Array.from({ length: 200 }, (_, i) => 1900 + i); // Example range from 1925 to 2024

	function onYearChange(year: string) {
		const newDate = setYear(date, parseInt(year));
		setDate(newDate);
		form.setValue("year", newDate, { shouldValidate: true });
	}
	useEffect(() => {
		if (initialData?.servicePricings?.[0]?.zonePricingEnabled) {
			setIsZoneActive(
				Boolean(initialData?.servicePricings?.[0]?.zonePricingEnabled ?? false),
			);
		}
		if (initialData?.servicePricings?.[0]?.zonePricings) {
			setZonePricing(initialData?.servicePricings?.[0]?.zonePricings ?? []);
		}
		if (initialData?.year) {
			form.setValue("year", initialData?.year, { shouldValidate: true });
		}
		if (initialData?.vehicleImages) {
			setPreviews(initialData?.vehicleImages?.map((img) => img?.url));
		}
	}, [initialData]);
	const transformInitialData = (data?: TFleetForm): TFleetForm | undefined => {
		if (!data) return undefined;
		// console.log("edit chauffeur formdata:>",data)
		return {
			regionId: data?.servicePricings?.[0]?.region?.id || "",
			description: data?.servicePricings?.[0]?.description || "",
			affiliateId: data?.affiliateId,
			plateNumber: data?.plateNumber,
			brand: data?.brand,
			documents: data?.documents,
			bagsCapacity: data?.bagsCapacity,
			capacity: data?.capacity,
			year: data?.year,
			color: data?.color,
			model: data?.model,
			vehicleType: data?.vehicleType,
			vehicleImages: data?.vehicleImages,
			status: data?.status,
			baseFair: data?.servicePricings?.[0]?.basePrice
				? Number(data?.servicePricings?.[0]?.basePrice)
				: 0,
			minHour: data?.servicePricings?.[0]?.minHour
				? Number(data?.servicePricings?.[0]?.minHour)
				: 0,
			pricePerMile: data?.servicePricings?.[0]?.pricePerMile
				? Number(data?.servicePricings?.[0]?.pricePerMile)
				: 0,
			pricePerHour: data?.servicePricings?.[0]?.ratePerHour
				? Number(data?.servicePricings?.[0]?.ratePerHour)
				: 0,
			pricePerMinute: data?.servicePricings?.[0]?.ratePerMinute
				? Number(data?.servicePricings?.[0]?.ratePerMinute)
				: 0,
			minFair: data?.servicePricings?.[0]?.minPrice
				? Number(data?.servicePricings?.[0]?.minPrice)
				: 0,
			cityToCityHourlyRate: data?.servicePricings?.[0]?.cityToCityHourlyRate
				? Number(data?.servicePricings?.[0]?.cityToCityHourlyRate)
				: 0,
			extraTime: data?.servicePricings?.[0]?.extraTime
				? Number(data?.servicePricings?.[0]?.extraTime)
				: 0,
			zonePricings: data?.servicePricings?.[0]?.zonePricings?.map((zone) => {
				return {
					zoneStart: zone?.zoneStart,
					zoneEnd: zone?.zoneEnd,
					pricePerMile: zone?.pricePerMile,
					pricePerDistance: zone?.pricePerDistance,
				};
			}),
		};
	};
	const imagesRef = useRef<HTMLInputElement | null>(null);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const form = useForm<TFleetForm>({
		// resolver: zodResolver(formSchema),
		defaultValues: transformInitialData(initialData) || {
			// name: "",
			regionId: "",
			plateNumber: "",
			affiliateId: "",
			description: "",
			vehicleImages: [],
			bagsCapacity: "",
			brand: "",
			color: "",
			model: "",
			vehicleType: "",
			status: "",
			//   status: "",
		},
	});

	const handleFilesChange = (
		files: FileList | null,
		onChange: (files: File[]) => void,
	) => {
		form.clearErrors();
		if (!files) return;
		if (files.length > 3) {
			form.setError("vehicleImages", {
				type: "custom",
				message: "Only 3 files are allowed.",
			});
			return;
		}
		const fileArray = Array.from(files);

		// update form field
		onChange(fileArray);

		// generate preview URLs
		const urls = fileArray.map((file) => URL.createObjectURL(file));
		console.log("urls:", urls);
		setPreviews((prev) => [...prev, ...urls]);
		console.log("preview urls:", previews);
	};

	const removeImage = (index: number, field: any) => {
		const updated = previews.filter((_, i) => i !== index);
		setPreviews(updated);
		field.onChange(updated); // keep in sync with form
	};

	// const documents = form.watch("documents");
	// const fileCount = documents?.length || 0;

	const handleFormSubmit = async (data: TFleetForm) => {
		try {
			console.log("description:", typeof data?.year);
			// console.log("description:",)
			const formData = new FormData();

			if (isZoneActive) {
				if (zonePricing && zonePricing.length > 0) {
					const formDataZone = [];
					zonePricing?.forEach((zone) => {
						formDataZone.push({
							zoneStart: zone.start,
							zoneEnd: zone.end,
							pricePerMile: zone.pricePerMile,
							pricePerMinute: zone.pricePerDistance,
						});
					});
					console.log(formDataZone);
					formData.append("zonePricings", JSON.stringify(formDataZone));
				} else {
					formData.append("zonePricings", null);
				}
			} else {
				formData.append("zonePricings", null);
			}
			//   formData.append("zonePricingEnabled", isZoneActive);

			formData.append("affiliateId", data?.affiliateId);
			formData.append("regionId", data?.regionId);
			formData.append("bagsCapacity", data?.bagsCapacity);
			formData.append("brand", data?.brand);
			formData.append("model", data?.model);
			formData.append("capacity", data?.capacity);
			formData.append("color", data?.color);
			formData.append("description", data?.description);
			formData.append("vehicleType", data?.vehicleType);
			formData.append("plateNumber", data?.plateNumber);
			formData.append("year", String(data?.year));
			formData.append("pricePerMinute", data?.pricePerMinute);
			formData.append("pricePerMile", data?.pricePerMile);
			formData.append("cityToCityHourlyRate", data?.cityToCityHourlyRate);
			formData.append("minimumFare", data?.minFair);
			formData.append("extraTime", data?.extraTime ?? 15);
			formData.append("ratePerHour", data?.pricePerHour);
			formData.append("minHours", data?.minHour);
			formData.append("basePrice", data?.baseFair);

			data?.documents?.forEach((file) => {
				if (file instanceof File) {
					console.log("file:", file instanceof File);
					formData.append(`documents`, file);
				}
			});
			data?.vehicleImages?.forEach((file) => {
				if (file instanceof File) {
					formData.append(`vehicleImages`, file);
				}
			});
			console.log("formData:", formData);
			await onSubmit(formData);
		} catch (error) {
			console.error("Error:", error);
		}
	};
	// const [statusValue, setStatusValue] = useState<{ status: string, affiliate: string }>({
	//     status: "",
	//     affiliate: ""
	// });
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleFormSubmit)}>
				{/* fleet Details */}
				<Card className="overflow-y-auto rounded">
					<CardHeader>
						<CardTitle>{type}</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-6 gap-5">
						<FormField
							control={form.control}
							name="regionId"
							render={({ field }) => (
								<FormItem className="col-span-3 col-start-1">
									<FormLabel>Region Id</FormLabel>
									{isRegionFetching ? (
										<h1>Loading...</h1>
									) : (
										<Select
											value={field.value}
											onValueChange={(v) => {
												field.onChange(v);
												// setStatusValue({ ...statusValue, affiliate: v })
											}}
											defaultValue={field.value}
										>
											<FormControl className="w-full min-w-full rounded">
												<SelectTrigger className="cursor-pointer w-full">
													<SelectValue
														className="placeholder:text-[#E6E6E6] font-medium"
														placeholder="select region"
													/>
													{/* <SelectValueContext className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select affiliate" /> */}
												</SelectTrigger>
											</FormControl>
											<SelectContent className="">
												{RegionData?.regions?.map((option) => (
													<SelectItem
														className="cursor-pointer capitalize"
														key={option.id}
														value={option.id}
													>
														{option.regionName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.name
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.regionId?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="affiliateId"
							render={({ field }) => (
								<FormItem className="w-full col-span-3 col-start-4">
									<FormLabel className="">Affiliate</FormLabel>
									{isAffiliateFetching ? (
										<h1>Loading...</h1>
									) : (
										<Select
											value={field.value}
											onValueChange={(v) => {
												field.onChange(v);
												// setStatusValue({ ...statusValue, affiliate: v })
											}}
											defaultValue={field.value}
										>
											<FormControl className="w-full min-w-full rounded">
												<SelectTrigger className="cursor-pointer w-full">
													<SelectValue
														className="placeholder:text-[#E6E6E6] font-medium"
														placeholder="select affiliate"
													/>
													{/* <SelectValueContext className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select affiliate" /> */}
												</SelectTrigger>
											</FormControl>
											<SelectContent className="">
												{affiliateData?.affiliates?.map((option) => (
													<SelectItem
														className="cursor-pointer"
														key={option.id}
														value={option.id}
													>
														{option.companyName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.affiliateId
												? "visible text-red-600"
												: "invisible"
										} `}
									>
										{form.formState.errors.affiliateId?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-6 col-start-1 placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Description</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Textarea
											placeholder="Write Full Description"
											disabled={isFieldDisabled(disabledFields, "description")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.description
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.description?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bagsCapacity"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Bags</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											type="number"
											// placeholder="Plate Number"
											disabled={isFieldDisabled(disabledFields, "bagsCapacity")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.bagsCapacity
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.bagsCapacity?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="capacity"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium ">
									<FormLabel>Capacity</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											type="number"
											disabled={isFieldDisabled(disabledFields, "capacity")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.capacity
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.capacity?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="baseFair"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Base Fair</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											type="number"
											disabled={isFieldDisabled(disabledFields, "baseFair")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.baseFair
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.baseFair?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="minFair"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Min Fair</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											type="number"
											disabled={isFieldDisabled(disabledFields, "minFair")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.minFair
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.minFair?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="minHour"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Min Hour</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											type="number"
											// placeholder="Plate Number"
											disabled={isFieldDisabled(disabledFields, "minHour")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.minHour
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.minHour?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pricePerHour"
							render={({ field }) => (
								<FormItem className="flex flex-col placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Price per hour</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											disabled={isFieldDisabled(disabledFields, "pricePerHour")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.pricePerHour
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.pricePerHour?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pricePerMile"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-2 col-start-1 placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Price per mile</FormLabel>
									<FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="0"
											disabled={isFieldDisabled(disabledFields, "pricePerMile")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.pricePerHour
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.pricePerMile?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pricePerMinute"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-2 col-start-3 placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Price per minute</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="0"
											disabled={isFieldDisabled(
												disabledFields,
												"pricePerMinute",
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.pricePerMinute
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.pricePerMinute?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cityToCityHourlyRate"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-2 col-start-5 placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>City To City Hourly Rate</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="0"
											disabled={isFieldDisabled(
												disabledFields,
												"cityToCityHourlyRate",
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.cityToCityHourlyRate
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.cityToCityHourlyRate?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="plateNumber"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-3  placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Plate Number</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="Plate Number"
											disabled={isFieldDisabled(disabledFields, "plateNumber")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.plateNumber
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.plateNumber?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="brand"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-3  placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Brand</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="Brand"
											disabled={isFieldDisabled(disabledFields, "brand")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.brand
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.brand?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="model"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-3  placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Model</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="Model"
											disabled={isFieldDisabled(disabledFields, "model")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.model
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.model?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem className="flex flex-col col-span-3  placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Color</FormLabel>
									<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
										<Input
											placeholder="Color"
											disabled={isFieldDisabled(disabledFields, "color")}
											{...field}
										/>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.color
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.color?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="year"
							render={({ field }) => (
								<FormItem className="flex flex-col   placeholder:text-[#E6E6E6] font-medium">
									<FormLabel>Year</FormLabel>
									<Select
										onValueChange={onYearChange}
										value={getYear(date).toString()}
									>
										<FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
											<SelectTrigger className="w-full cursor-pointer">
												{getYear(date)}
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{years.map((year) => (
												<SelectItem key={year} value={year.toString()}>
													{year}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.year
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.year?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="vehicleType"
							render={({ field }) => (
								<FormItem className="w-full col-span-3 col-start-2">
									<FormLabel className="">Vehicle Type</FormLabel>

									<Select
										value={field.value}
										onValueChange={(v) => {
											field.onChange(v);
											// setStatusValue({ ...statusValue, affiliate: v })
										}}
										defaultValue={field.value}
									>
										<FormControl className="w-full min-w-full rounded">
											<SelectTrigger className="cursor-pointer w-full">
												<SelectValue
													className="placeholder:text-[#E6E6E6] font-medium"
													placeholder="select affiliate"
												/>
												{/* <SelectValueContext className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select affiliate" /> */}
											</SelectTrigger>
										</FormControl>
										<SelectContent className="">
											{FleetOptions?.map((option, i) => (
												<SelectItem
													className="cursor-pointer"
													key={i}
													value={option}
												>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.affiliateId
												? "visible text-red-600"
												: "invisible"
										} `}
									>
										{form.formState.errors.affiliateId?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="zonePricings"
							render={({ field }) => (
								<FormItem className="flex flex-col col-start-1 col-span-6  placeholder:text-[#E6E6E6] font-medium cursor-pointer">
									<FormLabel>Zone Pricing</FormLabel>

									<FormControl className="px-3 py-4 rounded  placeholder:text-[#E6E6E6] font-medium">
										<Card>
											<CardHeader
												className={"flex flext start items-center my-5 mx-2.5"}
											>
												<input
													className="cursor-pointer"
													type="checkbox"
													checked={isZoneActive}
													onChange={() => setIsZoneActive(!isZoneActive)}
													id="zoneToggle"
												/>
												<label
													htmlFor="zoneToggle"
													className="cursor-pointer font-semibold ml-2.5 text-[#343434] select-none"
													style={{
														letterSpacing: "0px",
														opacity: "1",
													}}
												>
													Activate Zone Based Pricing
												</label>
											</CardHeader>

											<CardContent>
												{isZoneActive &&
													zonePricing?.map((zone, index) => (
														<div
															// className={styles.zoneGroup}
															className={cn("flex flex-col items-start mb-4 ")}
															key={index}
														>
															<label
																style={{
																	fontWeight: "600",
																	marginBottom: "8px",
																	// font: "normal normal normal 16px / 20px ProximaNovaBold",
																	textAlign: "left",
																	letterSpacing: "0px",
																	color: "#343434",
																	opacity: "1",
																}}
															>
																Zone {index + 1}
															</label>

															{/* <div className={styles.zoneFieldGroup}> */}
															<div
																className={
																	"flex gap-2 mb-5 items-start flex-col w-full"
																}
															>
																<div
																	// className={styles.labeledInput}
																	className={"flex flex-col w-full"}
																>
																	<label className="mb-1.5 text-[#343434] font-medium">
																		Zone Start (mile)
																	</label>
																	<input
																		className="py-3 px-4 rounded-md bg-[#2f4f5 0% 0% no-repeat padding-box] opacity-[1] border-2 outline-0 text-left text-[#707070]"
																		type="number"
																		placeholder="Start Mile"
																		value={zone.start}
																		step="0.01"
																		min={
																			index === 0
																				? 0.01
																				: zonePricing?.[index - 1]?.end
																		}
																		onChange={(e) => {
																			const newZones = [...zonePricing];
																			newZones[index].start = parseFloat(
																				e.target.value,
																			);
																			setZonePricing(newZones);
																		}}
																	/>
																</div>
																<div
																	// className={styles.labeledInput}
																	className={"flex flex-col w-full"}
																>
																	<label className="mb-1.5 text-[#343434] font-medium">
																		Zone End (mile)
																	</label>
																	<input
																		className="py-3 px-4 rounded-md bg-[#2f4f5 0% 0% no-repeat padding-box] opacity-[1] border-2 outline-0 text-left text-[#707070]"
																		type="number"
																		placeholder="End Mile"
																		value={zone.end}
																		step="0.01"
																		max={globalAirportLimit}
																		onChange={(e) => {
																			const newZones = [...zonePricing];
																			newZones[index].end = parseFloat(
																				e.target.value,
																			);
																			setZonePricing(newZones);
																		}}
																	/>
																</div>
																<div
																	// className={styles.labeledInput}
																	className={"flex flex-col w-full"}
																>
																	<label className="mb-1.5 text-[#343434] font-medium">
																		Price per Mile
																	</label>
																	<input
																		className="py-3 px-4 rounded-md bg-[#2f4f5 0% 0% no-repeat padding-box] opacity-[1] border-2 outline-0 text-left text-[#707070]"
																		type="number"
																		placeholder="Price Per Mile"
																		value={zone.pricePerMile}
																		step="0.01"
																		onChange={(e) => {
																			const newZones = [...zonePricing];
																			newZones[index].pricePerMile = parseFloat(
																				e.target.value,
																			);
																			setZonePricing(newZones);
																		}}
																	/>
																</div>
																<div
																	// className={styles.labeledInput}
																	className={"flex flex-col w-full"}
																>
																	<label className="mb-1.5 text-[#343434] font-medium">
																		Price per Minute
																	</label>
																	<input
																		className="py-3 px-4 rounded-md bg-[#2f4f5 0% 0% no-repeat padding-box] opacity-[1] border-2 outline-0 text-left text-[#707070]"
																		type="number"
																		placeholder="Price Per Minute"
																		step="0.01"
																		value={zone.pricePerDistance}
																		onChange={(e) => {
																			const newZones = [...zonePricing];
																			newZones[index].pricePerDistance =
																				parseFloat(e.target.value);
																			setZonePricing(newZones);
																		}}
																	/>
																</div>
																<Button
																	type="button"
																	className="ml-2.5 py-1.5 px-2.5"
																	padding="6px 10px"
																	onClick={() => {
																		const newZones = zonePricing?.filter(
																			(_, i) => i !== index,
																		);
																		setZonePricing(newZones);
																	}}
																>
																	Remove
																</Button>
															</div>
														</div>
													))}

												{isZoneActive && (
													<Button
														type="button"
														className="mt-2.5 mr-2.5 py-1.6 px-4 space-x-4"
														onClick={() => {
															if (zonePricing.length === 0) {
																setZonePricing([
																	{
																		start: 0.01,
																		end: 0,
																		pricePerMile: 0,
																		pricePerDistance: 0,
																	},
																]);
															} else {
																const lastEnd =
																	zonePricing?.[zonePricing.length - 1].end;
																if (lastEnd >= globalAirportLimit) {
																	toast({
																		title: "Global Airport Limit",
																		description: `Maximum limit of ${globalAirportLimit} miles reached`,
																		variant: "destructive",
																	});
																	return;
																}
																let finalLastEnd = lastEnd + 10;
																if (finalLastEnd >= globalAirportLimit) {
																	finalLastEnd = globalAirportLimit;
																}
																setZonePricing([
																	...zonePricing,
																	{
																		start: 0.01,
																		end: parseInt(finalLastEnd),
																		pricePerMile: 0,
																		pricePerDistance: 0,
																	},
																]);
															}
														}}
													>
														Add New Zone
													</Button>
												)}
												{isZoneActive && zonePricing.length > 0 && (
													<Button
														type="button"
														className="my-2.5 py-1.5 px-4"
														onClick={() => setZonePricing([])}
													>
														Clear All Zones
													</Button>
												)}
											</CardContent>
										</Card>
									</FormControl>
									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.year
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.year?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="vehicleImages"
							defaultValue={[]}
							render={({ field }) => (
								<FormItem className="col-span-6 rounded">
									<FormLabel>Upload Vehicle Images (max 3)</FormLabel>
									<FormControl>
										{/* Hidden File Input */}
										<Input
											ref={imagesRef}
											type="file"
											accept="image/*"
											multiple
											className="hidden"
											value={undefined}
											onChange={(e) =>
												handleFilesChange(e.target.files, field.onChange)
											}
										/>
									</FormControl>

									{/* Image Previews */}
									<div className="mt-2 flex gap-3">
										{previews.map((src, index) => (
											<div
												key={index}
												className="relative w-28 h-28 bg-[#D9D9D9] flex items-center justify-center rounded-md overflow-hidden"
											>
												<img
													src={src}
													alt="preview"
													className="object-cover w-full h-full"
												/>
												{/* Camera / Clear Icon */}
												<button
													type="button"
													onClick={() => removeImage(index, field)}
													className="cursor-pointer absolute top-1 right-1 bg-white rounded p-1"
												>
													<X className="h-4 w-4 text-red-500" />
												</button>
											</div>
										))}

										{/* Add new placeholder */}
										<button
											type="button"
											onClick={() => imagesRef.current?.click()}
											className="w-28 h-28 cursor-pointer border border-dashed border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
										>
											<Plus className="h-6 w-6 text-gray-500" />
										</button>
									</div>

									<FormMessage
										className={`mt-1 h-5 ${
											form.formState.errors.vehicleImages
												? "visible text-red-600"
												: "invisible"
										}`}
									>
										{form.formState.errors.vehicleImages?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="documents"
							defaultValue={[]}
							render={({ field }) => (
								<FormItem className="col-span-6 rounded ">
									<FormLabel>
										Upload Documents:{" "}
										{[
											"Document 1*",
											"Document 2*",
											"Document 3*",
											"Document 4*",
										].map((text, idx) => (
											<span
												key={idx}
												className={
													idx < field.value.length
														? "text-gray-700 underline"
														: "text-gray-300"
												}
											>
												{text}{" "}
											</span>
										))}
									</FormLabel>
									<FormControl>
										<Input
											className="rounded cursor-pointer placeholder-[#E6E6E6]"
											type="file"
											ref={fileRef}
											multiple
											accept="image/jpeg,image/png,application/pdf"
											value={undefined}
											onChange={(e) => {
												const newFiles = Array.from(e.target.files ?? []);
												// Filter out File objects from current value (keep only document objects with url)
												const existingDocs = field.value.filter(
													(doc: any) =>
														!(doc instanceof File) &&
														(doc?.url ?? doc?.fileUrl),
												);
												field.onChange([...existingDocs, ...newFiles]);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<div className="flex items-center justify-start rounded px-6 space-x-2.5">
						<Button
							className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50"
							variant={"secondary"}
							type="button"
							onClick={() => {
								form.reset({
									affiliateId: "",
									vehicleImages: [],
									status: "",
								});
							}}
						>
							Clear Alls
						</Button>
						<Button
							className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50"
							variant={"secondary"}
							type="submit"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting ? "Saving..." : "Save Details"}
						</Button>
					</div>
				</Card>
			</form>
		</Form>
	);
};

export default FleetForm;
