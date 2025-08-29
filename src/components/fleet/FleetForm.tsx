import type { IFleetFormProps } from "@/types/fleet"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import isFieldDisabled from "@/utils/disableFormField"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectValueContext } from "react-aria-components"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { X, Camera, Plus, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { setYear, getYear } from "date-fns";

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
    id: z.string().optional(),
    year: z.date(),
    name: z.string().refine(value => value.trim() !== "", {
        message: "Fleet name cannot be empty or just whitespace.",
    }).min(3, { message: "Fleet name must be at least 3 characters" }),
    description: z.string().refine(value => value.trim() !== "", {
        message: "Description  cannot be empty or just whitespace.",
    }).min(3, { message: "Description  must be at least 3 characters" }),
    plateNumber: z.string().refine(value => value.trim() !== "", {
        message: "Plate number  cannot be empty or just whitespace.",
    }).min(3, { message: "Plate number  must be at least 3 characters" }),
    brand: z.string().refine(value => value.trim() !== "", {
        message: "Brand cannot be empty or just whitespace.",
    }).min(3, { message: "Brand must be at least 3 characters" }),
    affiliateId: z.string().refine(value => value.trim() !== "", {
        message: "Affiliate id cannot be empty or just whitespace.",
    }).min(3, { message: "Affiliate id must be at least 3 characters" }),
    model: z.string().refine(value => value.trim() !== "", {
        message: "Model cannot be empty or just whitespace.",
    }).min(3, { message: "Model must be at least 3 characters" }),
    color: z.string().refine(value => value.trim() !== "", {
        message: "Color cannot be empty or just whitespace.",
    }).min(3, { message: "Color must be at least 3 characters" }),
    cityToCityHourlyRate: z.string()
        .min(1, { message: "City to city hourly rate is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    capacity: z.string()
        .min(1, { message: "Capacity  is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    baseFair: z.string()
        .min(1, { message: "Base fair is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    minFair: z.string()
        .min(1, { message: "Min fair is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    minHour: z.string()
        .min(1, { message: "Min hour is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    pricePerMile: z.string()
        .min(1, { message: "Price per mile is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    pricePerHour: z.string()
        .min(1, { message: "Price per hour is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    pricePerMinute: z.string()
        .min(1, { message: "Price per minute is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    vehicleType: z.string().refine(value => value.trim() !== "", {
        message: "Vehicle type  cannot be empty or just whitespace.",
    }).min(3, { message: "Vehicle type must be at least 3 characters" }),
    bagsCapacity: z.string().refine(value => value.trim() !== "", {
        message: "Bags capacity  cannot be empty or just whitespace.",
    }),
    vehicleImages: z.custom<FileList>().check((ctx) => {
        const list = ctx.value;
        if (list.length < 1) {
            ctx.issues.push({ code: "custom", message: "Select at least 1 file", input: list });
        }
        //   console.log("list:")
        if (list.length > 4) {
            ctx.issues.push({ code: "custom", message: "You can upload up to 4 files", input: list });
        }
    }).transform(list => Array.from(list)).refine(files => files.every(f => f.size <= maxSize), {
        message: `Max size ${maxSize / (1024 * 1024)}MB`,
    })
        .refine(files => files.every(f => ALLOWED_MIME_TYPES.includes(f.type)), {
            message: "Invalid file types detected",
        }),
    status: z.string().optional(),
});

export type TFleetForm = z.infer<typeof formSchema>;

const fleetOption = [
    {
        id: "djksaf",
        affiliate: "affiliate1"
    },
    {
        id: "djksag",
        affiliate: "affiliate2"
    },
    {
        id: "djksah",
        affiliate: "affiliate3"
    },
    {
        id: "djksai",
        affiliate: "affiliate4"
    },
]

const FleetForm = ({ initialData, onSubmit, disabledFields, type }: IFleetFormProps) => {
    const [zonePricing, setZonePricing] = useState([]);
    const [isZoneActive, setIsZoneActive] = useState(false);
    const [previews, setPreviews] = useState<string[]>([])
    const [date, setDate] = useState(new Date());
    const years = Array.from({ length: 200 }, (_, i) => 1900 + i); // Example range from 1925 to 2024

    function onYearChange(year: string) {
        const newDate = setYear(date, parseInt(year));
        setDate(newDate);
    }
    const transformInitialData = async (data?: TFleetForm): TFleetForm | undefined => {
        if (!data) return undefined;
        // console.log("edit chauffeur formdata:>",data)
        return {
            name: data?.name,
            description: data?.description,
            affiliateId: data?.affiliateId,
            plateNumber: data?.plateNumber,
            brand: data?.brand,
            bagsCapacity: data?.bagsCapacity,
            color: data?.color,
            model: data?.model,
            vehicleType: data?.vehicleType,
            vehicleImages: data?.vehicleImages,
            status: data?.status,
        };

    };
    const fileRef = useRef<HTMLInputElement | null>(null)
    const form = useForm<TFleetForm>({
        // resolver: zodResolver(formSchema),
        defaultValues: transformInitialData(initialData) || {
            name: "",
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

        }
    });

    const handleFilesChange = (files: FileList | null, onChange: (files: File[]) => void) => {
        form.clearErrors();
        if (!files) return
        if (files.length > 3) {
            form.setError("vehicleImages", {
                type: "custom",
                message: "Only 3 files are allowed."
            });
            return;
        }
        const fileArray = Array.from(files)

        // update form field
        onChange(fileArray)

        // generate preview URLs
        const urls = fileArray.map(file => URL.createObjectURL(file))
        setPreviews(urls)
    }

    const removeImage = (index: number, field: any) => {
        const updated = previews.filter((_, i) => i !== index)
        setPreviews(updated)
        field.onChange(updated) // keep in sync with form
    }

    const handleFormSubmit = async (data: TFleetForm) => {
        try {
        // if (isZoneActive) {
        //     if (zonePricing && zonePricing.length > 0) {
        //         let formDataZone = [];
        //         zonePricing.forEach((zone) => {
        //             formDataZone.push({
        //                 zoneStart: zone.start,
        //                 zoneEnd: zone.end,
        //                 zonePricePerMile: zone.pricePerMile,
        //                 zonePricePerMinute: zone.pricePerDistance,
        //             });
        //         });
        //         console.log(formDataZone);
        //         formData.append("zonePrice", JSON.stringify(formDataZone));
        //     } else {
        //         formData.append("zonePrice", null);
        //     }
        // } else {
        //     formData.append("zonePrice", null);
        // }
        //     formData.append("zonePricingEnabled", isZoneActive);
            await onSubmit(data);
        } catch (error) {
            console.error("Error:", error)
        }
    }
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-3 col-start-1">
                                    <FormLabel>Fleet Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                        <Input
                                            placeholder="Fleet Name"
                                            disabled={isFieldDisabled(disabledFields, "name")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.name ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.name?.message}
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
                                    <Select value={field.value} onValueChange={(v) => {
                                        field.onChange(v);
                                        // setStatusValue({ ...statusValue, affiliate: v })
                                    }} defaultValue={field.value}>
                                        <FormControl className="w-full min-w-full rounded">

                                            <SelectTrigger className="cursor-pointer w-full">
                                                <SelectValue className="placeholder:text-[#E6E6E6] font-medium" placeholder="select affiliate" />
                                                {/* <SelectValueContext className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select affiliate" /> */}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="">
                                            {fleetOption.map(option => (
                                                <SelectItem className="cursor-pointer" key={option.id} value={option.id}>{option.affiliate}</SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.affiliateId ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.description ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.bagsCapacity ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.capacity ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.baseFair ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.minFair ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.minHour ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.pricePerHour ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.pricePerHour ? 'visible text-red-600' : 'invisible'
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
                                            disabled={isFieldDisabled(disabledFields, "pricePerMinute")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.pricePerMinute ? 'visible text-red-600' : 'invisible'
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
                                            disabled={isFieldDisabled(disabledFields, "cityToCityHourlyRate")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.cityToCityHourlyRate ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.plateNumber ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.brand ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.model ? 'visible text-red-600' : 'invisible'
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
                                        className={`mt-1 h-5 ${form.formState.errors.color ? 'visible text-red-600' : 'invisible'
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
                                <FormItem className="flex flex-col   placeholder:text-[#E6E6E6] font-medium cursor-pointer">
                                    <FormLabel>Year</FormLabel>
                                    <Select onValueChange={onYearChange} value={getYear(date).toString()}>
                                        <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">

                                            <SelectTrigger className="w-full">{getYear(date)}</SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {years.map(year => (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>


                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.year ? 'visible text-red-600' : 'invisible'
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
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            value={undefined}
                                            onChange={(e) => handleFilesChange(e.target.files, field.onChange)}
                                        />
                                    </FormControl>

                                    {/* Image Previews */}
                                    <div className="mt-2 flex gap-3">
                                        {previews.map((src, index) => (
                                            <div
                                                key={index}
                                                className="relative w-28 h-28 bg-[#D9D9D9] flex items-center justify-center rounded-md overflow-hidden"
                                            >
                                                <img src={src} alt="preview" className="object-cover w-full h-full" />
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
                                            onClick={() => fileRef.current?.click()}
                                            className="w-28 h-28 cursor-pointer border border-dashed border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                                        >
                                            <Plus className="h-6 w-6 text-gray-500" />
                                        </button>
                                    </div>

                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.vehicleImages ? "visible text-red-600" : "invisible"
                                            }`}
                                    >
                                        {form.formState.errors.vehicleImages?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <div className="flex items-center justify-start rounded px-6 space-x-2.5">
                        <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="button" onClick={() => {
                            form.reset({
                                affiliateId: "",
                                vehicleImages: [],
                                status: ""
                            });

                        }} >
                            Clear Alls
                        </Button>
                        <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save Details"}
                        </Button>
                    </div>
                </Card>
            </form>
        </Form>
    )
}

export default FleetForm
