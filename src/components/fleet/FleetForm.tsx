// @ts-nocheck

import {
  IconBrand4chan,
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconPackage,
  IconPalette,
  IconUsers,
} from "@tabler/icons-react";
import { getYear, setYear } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Spinner } from "../Spinner";
import { Button } from "../ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SelectDropDown } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FilesUpload from "../ui/upload-files";
import ImagesUpload from "../ui/upload-images";

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
  const [globalAirportLimit, _setGlobalAirportLimit] = useState("65");
  const [zonePricing, setZonePricing] = useState([]);
  const [isZoneActive, setIsZoneActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [date, setDate] = useState(new Date());
  const years = Array.from({ length: 200 }, (_, i) => 1900 + i); // Example range from 1925 to 2024

  function onYearChange(year: string) {
    const newDate = setYear(date, parseInt(year, 10));
    setDate(newDate);
    form.setValue("year", newDate, { shouldValidate: true });
  }

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
  }, [initialData, form]);

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

  const removeImage = (index: number, field: unknown) => {
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
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="regionId"
                  className="text-base-black gap-0"
                >
                  Region
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="regionId"
                  render={({ field }) =>
                    isRegionFetching ? (
                      <Spinner />
                    ) : (
                      <SelectDropDown
                        placeholder="Select Region"
                        items={
                          RegionData?.regions?.map((r) => ({
                            label: r.regionName, // dynamic label
                            value: r.id, // dynamic value
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )
                  }
                />

                <FieldDescription className="mt-1">
                  Select your region.
                </FieldDescription>

                {form.formState.errors.regionId && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.regionId.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="affiliateId"
                  className="text-base-black gap-0"
                >
                  Affiliate
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="affiliateId"
                  render={({ field }) =>
                    isAffiliateFetching ? (
                      <Spinner />
                    ) : (
                      <SelectDropDown
                        placeholder="Select Affiliate"
                        items={
                          affiliateData?.affiliates?.map((a) => ({
                            label: a.companyName,
                            value: a.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )
                  }
                />

                <FieldDescription className="mt-1">
                  Select Affiliate
                </FieldDescription>

                {form.formState.errors.affiliateId && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.affiliateId.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="description"
                  className="text-base-black gap-0"
                >
                  Description
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      placeholder="Write Full Description"
                      disabled={isFieldDisabled(disabledFields, "description")}
                      {...field}
                    />
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter a detailed description.
                </FieldDescription>

                {form.formState.errors.description && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="bagsCapacity"
                  className="text-base-black gap-0"
                >
                  Bags
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="bagsCapacity"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="bagsCapacity"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "bagsCapacity",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconPackage />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the bag capacity.
                </FieldDescription>

                {form.formState.errors.bagsCapacity && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.bagsCapacity.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="capacity"
                  className="text-base-black gap-0"
                >
                  Capacity
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="capacity"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(disabledFields, "capacity")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUsers />{" "}
                        {/* Example icon for capacity/passenger count */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the vehicle capacity.
                </FieldDescription>

                {form.formState.errors.capacity && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.capacity.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="baseFair"
                  className="text-base-black gap-0"
                >
                  Base Fare
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="baseFair"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="baseFair"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(disabledFields, "baseFair")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the base fare amount.
                </FieldDescription>

                {form.formState.errors.baseFair && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.baseFair.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="minFair" className="text-base-black gap-0">
                  Min Fare
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="minFair"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="minFair"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(disabledFields, "minFair")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the minimum fare amount.
                </FieldDescription>

                {form.formState.errors.minFair && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.minFair.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="minHour" className="text-base-black gap-0">
                  Min Hour
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="minHour"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="minHour"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(disabledFields, "minHour")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconClock />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the minimum number of hours.
                </FieldDescription>

                {form.formState.errors.minHour && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.minHour.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="pricePerHour"
                  className="text-base-black gap-0"
                >
                  Price per hour
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="pricePerHour"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pricePerHour"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "pricePerHour",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the price per hour.
                </FieldDescription>

                {form.formState.errors.pricePerHour && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.pricePerHour.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="pricePerMile"
                  className="text-base-black gap-0"
                >
                  Price per mile
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="pricePerMile"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pricePerMile"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "pricePerMile",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />{" "}
                        {/* Example icon for price/currency */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the price per mile.
                </FieldDescription>

                {form.formState.errors.pricePerMile && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.pricePerMile.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="pricePerMinute"
                  className="text-base-black gap-0"
                >
                  Price per minute
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="pricePerMinute"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pricePerMinute"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "pricePerMinute",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />{" "}
                        {/* Example icon for price/currency */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the price per minute.
                </FieldDescription>

                {form.formState.errors.pricePerMinute && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.pricePerMinute.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="cityToCityHourlyRate"
                  className="text-base-black gap-0"
                >
                  City To City Hourly Rate
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="cityToCityHourlyRate"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="cityToCityHourlyRate"
                        type="number"
                        placeholder="0"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "cityToCityHourlyRate",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />{" "}
                        {/* Example icon for rate/currency */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the city-to-city hourly rate.
                </FieldDescription>

                {form.formState.errors.cityToCityHourlyRate && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.cityToCityHourlyRate.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="plateNumber"
                  className="text-base-black gap-0"
                >
                  Plate Number
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="plateNumber"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="plateNumber"
                        type="text"
                        placeholder="Plate Number"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "plateNumber",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCreditCard />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the vehicle plate number.
                </FieldDescription>

                {form.formState.errors.plateNumber && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.plateNumber.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="brand" className="text-base-black gap-0">
                  Brand
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="brand"
                        type="text"
                        placeholder="Brand"
                        disabled={isFieldDisabled(disabledFields, "brand")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBrand4chan />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the vehicle brand.
                </FieldDescription>

                {form.formState.errors.brand && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.brand.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="model" className="text-base-black gap-0">
                  Model
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="model"
                        type="text"
                        placeholder="Model"
                        disabled={isFieldDisabled(disabledFields, "model")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCalendar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the vehicle model.
                </FieldDescription>

                {form.formState.errors.model && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.model.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="color" className="text-base-black gap-0">
                  Color
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="color"
                        type="text"
                        placeholder="Color"
                        disabled={isFieldDisabled(disabledFields, "color")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconPalette />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter the vehicle color.
                </FieldDescription>

                {form.formState.errors.color && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.color.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="year" className="text-base-black gap-0">
                  Year
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select year"
                      items={years.map((y) => ({
                        label: y.toString(),
                        value: y.toString(),
                      }))}
                      value={field.value || getYear(date).toString()}
                      setSelectedItem={(val) => field.onChange(val)}
                    />
                  )}
                />

                <FieldDescription className="mt-1">
                  Select the vehicle year.
                </FieldDescription>

                {form.formState.errors.year && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.year.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="vehicleType"
                  className="text-base-black gap-0"
                >
                  Vehicle Type
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select vehicle type"
                      items={
                        FleetOptions?.map((option) => ({
                          label: option,
                          value: option,
                        })) || []
                      }
                      value={field.value || ""}
                      setSelectedItem={(val) => field.onChange(val)}
                    />
                  )}
                />

                <FieldDescription className="mt-1">
                  Select the type of vehicle.
                </FieldDescription>

                {form.formState.errors.vehicleType && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.vehicleType.message}
                  </p>
                )}
              </Field>

              <FormField
                control={form.control}
                name="zonePricings"
                render={({ _field }) => (
                  <FormItem className="flex flex-col  placeholder:text-[#E6E6E6] font-medium cursor-pointer">
                    <FormLabel>Zone Pricing</FormLabel>

                    <FormControl className="px-3 py-4 rounded  placeholder:text-[#E6E6E6] font-medium">
                      <Card>
                        <CardHeader
                          className={
                            "flex flext start items-center my-5 mx-2.5"
                          }
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
                                className={cn(
                                  "flex flex-col items-start mb-4 ",
                                )}
                                key={`${index}-${zone.end}`}
                              >
                                <label
                                  htmlFor="zone"
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
                                    <label
                                      htmlFor="zoneStart"
                                      className="mb-1.5 text-[#343434] font-medium"
                                    >
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
                                    <label
                                      htmlFor="zoneEnd"
                                      className="mb-1.5 text-[#343434] font-medium"
                                    >
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
                                    <label
                                      htmlFor="pricePerPMile"
                                      className="mb-1.5 text-[#343434] font-medium"
                                    >
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
                                        newZones[index].pricePerMile =
                                          parseFloat(e.target.value);
                                        setZonePricing(newZones);
                                      }}
                                    />
                                  </div>
                                  <div
                                    // className={styles.labeledInput}
                                    className={"flex flex-col w-full"}
                                  >
                                    <label
                                      htmlFor="pricePerPMin"
                                      className="mb-1.5 text-[#343434] font-medium"
                                    >
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
                                      end: parseInt(finalLastEnd, 10),
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
                              onClick={() => setZonePricing([])}
                            >
                              Clear All Zones
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.year ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.year?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Field className="col-span-full">
                <Controller
                  control={form.control}
                  name="vehicleImages"
                  render={({ field }) => (
                    <ImagesUpload
                      title="Upload Vehicle Images"
                      maxSize={10}
                      multiple
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isFieldDisabled(
                        disabledFields,
                        "vehicleImages",
                      )}
                    />
                  )}
                />

                {form.formState.errors.vehicleImages && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.vehicleImages.message}
                  </p>
                )}
              </Field>
              <Field className="col-span-full">
                <Controller
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FilesUpload
                      title="Upload Documents"
                      accept="image/jpeg,image/png,application/pdf"
                      maxSize={10}
                      multiple
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isFieldDisabled(disabledFields, "documents")}
                    />
                  )}
                />

                {form.formState.errors.documents && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.documents.message}
                  </p>
                )}
              </Field>
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                variant="outlinePrimary"
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default FleetForm;
