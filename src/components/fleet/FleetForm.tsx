// @ts-nocheck

import {
  IconBrand4chan,
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconFlag,
  IconPackage,
  IconPalette,
  IconRuler,
  IconTimeDuration0,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Form, FormMessage } from "@/components/ui/form";
import { useUserStore } from "@/stores/useAuthStore";
import type { IFleetFormProps } from "@/types/fleet.type";
import isFieldDisabled from "@/utils/disableFormField";
import { styledLog } from "@/utils/styledLog";
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
import { Checkbox } from "../ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SelectDropDown } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FilesUpload from "../ui/upload-files";

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const zonePricingSchema = z.discriminatedUnion("zonePricingEnabled", [
  z.object({
    zonePricingEnabled: z.literal(true),
    zonePricings: z
      .array(
        z.object({
          zoneStart: z.number().gt(0),
          zoneEnd: z.number().gt(0),
          pricePerMile: z.number(),
          pricePerMinute: z.number(),
        }),
      )
      .min(1),
  }),
  z.object({ zonePricingEnabled: z.literal(false) }),
]);

const formSchema = z
  .object({
    year: z.number(),
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
      .min(3, { message: "Partner id must be at least 3 characters" }),
    regionId: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "Partner id cannot be empty or just whitespace.",
      })
      .min(3, { message: "Partner id must be at least 3 characters" }),
    partnerId: z
      .string()
      .refine((value) => value.trim() !== "", {
        message: "Partner id cannot be empty or just whitespace.",
      })
      .min(3, { message: "Partner id must be at least 3 characters" }),
    // zonePricings: z.string().refine(value => value.trim() !== "", {
    //     message: "zonePricings id cannot be empty or just whitespace.",
    // }).min(3, { message: "Partner id must be at least 3 characters" }),
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
  })
  .and(zonePricingSchema);

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

// const transformInitialData = (data?: TFleetForm): TFleetForm | undefined => {
// 	if (!data) return undefined;
// 	// console.log("edit chauffeur formdata:>",data)
// 	const base = {
// 		regionId: data?.servicePricings?.[0]?.region?.id || "",
// 		description: data?.servicePricings?.[0]?.description || "",
// 		partnerId: data?.partnerId,
// 		plateNumber: data?.plateNumber,
// 		brand: data?.brand,
// 		documents: data?.documents,
// 		bagsCapacity: data?.bagsCapacity,
// 		capacity: data?.capacity,
// 		year: data?.year,
// 		color: data?.color,
// 		model: data?.model,
// 		vehicleType: data?.vehicleType,
// 		vehicleImages: data?.vehicleImages,
// 		status: data?.status,
// 		baseFair: data?.servicePricings?.[0]?.basePrice
// 			? Number(data?.servicePricings?.[0]?.basePrice)
// 			: 0,
// 		minHour: data?.servicePricings?.[0]?.minHour
// 			? Number(data?.servicePricings?.[0]?.minHour)
// 			: 0,
// 		pricePerMile: data?.servicePricings?.[0]?.pricePerMile
// 			? Number(data?.servicePricings?.[0]?.pricePerMile)
// 			: 0,
// 		pricePerHour: data?.servicePricings?.[0]?.ratePerHour
// 			? Number(data?.servicePricings?.[0]?.ratePerHour)
// 			: 0,
// 		pricePerMinute: data?.servicePricings?.[0]?.ratePerMinute
// 			? Number(data?.servicePricings?.[0]?.ratePerMinute)
// 			: 0,
// 		minFair: data?.servicePricings?.[0]?.minPrice
// 			? Number(data?.servicePricings?.[0]?.minPrice)
// 			: 0,
// 		cityToCityHourlyRate: data?.servicePricings?.[0]?.cityToCityHourlyRate
// 			? Number(data?.servicePricings?.[0]?.cityToCityHourlyRate)
// 			: 0,
// 		extraTime: data?.servicePricings?.[0]?.extraTime
// 			? Number(data?.servicePricings?.[0]?.extraTime)
// 			: 0,
// 	};

// 	const zonePricing =
// 		data?.servicePricings?.[0]?.zonePricingEnabled === true
// 			? {
// 					zonePricingEnabled: true,
// 					zonePricings: data?.servicePricings?.[0]?.zonePricings?.map(
// 						(zone) => {
// 							return {
// 								zoneStart: zone?.zoneStart,
// 								zoneEnd: zone?.zoneEnd,
// 								pricePerMile: zone?.pricePerMile,
// 								pricePerDistance: zone?.pricePerDistance,
// 							};
// 						},
// 					),
// 				}
// 			: {
// 					zonePricingEnabled: false,
// 				};

// 	return {
// 		...base,
// 		...zonePricing,
// 	};
// };

const transformInitialData = (data?: TFleetForm): TFleetForm | undefined => {
  if (!data) return undefined;
  styledLog(data, "transform data:", "alert");
  const base = {
    regionId: data?.servicePricings?.[0]?.region?.id || "",
    description: data?.servicePricings?.[0]?.description || "",
    partnerId: data?.partnerId,
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
    baseFair: Number(data?.servicePricings?.[0]?.basePrice ?? 0),
    minHour: Number(data?.servicePricings?.[0]?.minHour ?? 0),
    pricePerMile: Number(data?.servicePricings?.[0]?.pricePerMile ?? 0),
    pricePerHour: Number(data?.servicePricings?.[0]?.ratePerHour ?? 0),
    pricePerMinute: Number(data?.servicePricings?.[0]?.ratePerMinute ?? 0),
    minFair: Number(data?.servicePricings?.[0]?.minPrice ?? 0),
    cityToCityHourlyRate: Number(
      data?.servicePricings?.[0]?.cityToCityHourlyRate ?? 0,
    ),
    extraTime: Number(data?.servicePricings?.[0]?.extraTime ?? 0),
  };

  const zoneEnabled = data?.servicePricings?.[0]?.zonePricingEnabled ?? false;

  const zonePricing = zoneEnabled
    ? {
        zonePricingEnabled: true,
        zonePricings:
          data?.servicePricings?.[0]?.zonePricings?.map((zone) => ({
            zoneStart: !Number.isNaN(zone.zoneStart)
              ? Number(zone.zoneStart)?.toFixed(2)
              : 0,
            zoneEnd: !Number.isNaN(zone.zoneEnd)
              ? Number(zone.zoneEnd)?.toFixed(2)
              : 0,
            pricePerMile: !Number.isNaN(zone.pricePerMile)
              ? Number(zone.pricePerMile)?.toFixed(2)
              : 0,
            pricePerMinute: !Number.isNaN(zone.pricePerMinute)
              ? Number(zone.pricePerMinute)?.toFixed(2)
              : 0,
          })) ?? [],
      }
    : {
        zonePricingEnabled: false,
        zonePricings: [],
      };

  return {
    ...base,
    ...zonePricing,
  };
};

const defaultFleetFormValues: TFleetForm = {
  regionId: "",
  description: "",
  partnerId: "",
  plateNumber: "",
  brand: "",
  model: "",
  color: "",
  year: new Date().getFullYear(),
  vehicleType: "",
  bagsCapacity: "",
  capacity: 0,
  baseFair: 0,
  minFair: 0,
  minHour: 0,
  pricePerMile: 0,
  pricePerHour: 0,
  pricePerMinute: 0,
  cityToCityHourlyRate: 0,
  extraTime: 0,
  vehicleImages: [] as unknown as FileList,
  status: "",
  zonePricingEnabled: false,
  zonePricings: [],
};

const FleetForm = ({
  initialData,
  isPartnerFetching,
  isRegionFetching,
  partnerData,
  RegionData,
  onSubmit,
  disabledFields,
  type,
}: IFleetFormProps) => {
  const [globalAirportLimit, _setGlobalAirportLimit] = useState("65");

  const [previews, setPreviews] = useState<string[]>([]);
  const [_date, setDate] = useState(new Date());
  const years = Array.from({ length: 200 }, (_, i) => 1900 + i);

  const form = useForm<TFleetForm>({
    // resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || defaultFleetFormValues,
  });

  const { isSubmitting } = form.formState;

  const {
    fields: zonePricingsFields,
    replace: replaceZonePricings,
    append: appendZonePricings,
    remove: removeZonePricings,
  } = useFieldArray({
    control: form.control,
    name: "zonePricings",
  });

  const handleAddZone = () => {
    const zones = form.watch("zonePricings") || [];

    if (!zones || zones.length === 0) {
      appendZonePricings({
        zoneStart: 0.01,
        zoneEnd: 10,
        pricePerMile: 0,
        pricePerMinute: 0,
      });
      return;
    }

    const numericEnds = zones.map((z) => Number(z.zoneEnd || 0));
    // console.log("numericEnds:",numericEnds)
    const lastEnd = Math.max(...numericEnds); // robust to deletes / reordering
    // console.log("lastEnd:",lastEnd)
    if (lastEnd >= globalAirportLimit) {
      // optional: notify user that max limit reached
      toast.error("Opps! global limit hit cannot add more zones");
      return;
    }

    let newEnd = lastEnd + 10;

    if (newEnd > globalAirportLimit) {
      newEnd = globalAirportLimit;
    }

    appendZonePricings({
      zoneStart: 0.01, // new zone start = previous zone end
      zoneEnd: newEnd,
      pricePerMile: 0,
      pricePerMinute: 0,
    });
  };

  useEffect(() => {
    // if (initialData?.servicePricings?.[0]?.zonePricingEnabled) {
    //   setIsZoneActive(
    //     Boolean(initialData?.servicePricings?.[0]?.zonePricingEnabled ?? false),
    //   );
    // }
    // if (initialData?.servicePricings?.[0]?.zonePricings) {
    //   setZonePricing(initialData?.servicePricings?.[0]?.zonePricings ?? []);
    // }
    if (initialData?.year) {
      form.setValue("year", initialData?.year, { shouldValidate: true });
    }
    if (initialData?.vehicleImages) {
      setPreviews(initialData?.vehicleImages?.map((img) => img?.url));
    }
  }, [initialData, form]);

  const { user } = useUserStore();
  const userRoles = user?.roles || [];
  const isPartner = userRoles.includes("Partner");

  useEffect(() => {
    if (isPartner && partnerData?.partners && !initialData) {
      const currentPartner = partnerData.partners.find(
        (a) => a.userId === user?.id,
      );
      if (currentPartner) {
        form.setValue("partnerId", currentPartner.id, {
          shouldValidate: true,
        });
      }
    }
  }, [isPartner, partnerData, user, form, initialData]);

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
    // console.log("description:", typeof data?.year);
    // console.log("description:",)
    const formData = new FormData();

    if (data?.zonePricingEnabled) {
      if (data?.zonePricings && data?.zonePricings?.length > 0) {
        formData.append("zonePricings", JSON.stringify(data?.zonePricings));
      } else {
        formData.append("zonePricings", null);
      }
    }

    formData.append("zonePricingEnabled", data?.zonePricingEnabled);
    formData.append("partnerId", data?.partnerId);
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
  };
  // const [statusValue, setStatusValue] = useState<{ status: string, Partner: string }>({
  //     status: "",
  //     Partner: ""
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

                <FieldDescription>Select your region.</FieldDescription>

                {form.formState.errors.regionId && (
                  <FormMessage>
                    {form.formState.errors.regionId.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="partnerId"
                  className="text-base-black gap-0"
                >
                  Partner
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="partnerId"
                  render={({ field }) =>
                    isPartnerFetching ? (
                      <Spinner />
                    ) : (
                      <SelectDropDown
                        placeholder="Select Partner"
                        disabled={
                          isPartner ||
                          isFieldDisabled(disabledFields, "partnerId")
                        }
                        items={
                          partnerData?.partners?.map((a) => ({
                            label: `${a.user.firstName} ${a.user.lastName}`,
                            value: a.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )
                  }
                />

                <FieldDescription>Select Partner</FieldDescription>

                {form.formState.errors.partnerId && (
                  <FormMessage>
                    {form.formState.errors.partnerId.message}
                  </FormMessage>
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

                <FieldDescription>
                  Enter a detailed description.
                </FieldDescription>

                {form.formState.errors.description && (
                  <FormMessage>
                    {form.formState.errors.description.message}
                  </FormMessage>
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

                <FieldDescription>Enter the bag capacity.</FieldDescription>

                {form.formState.errors.bagsCapacity && (
                  <FormMessage>
                    {form.formState.errors.bagsCapacity.message}
                  </FormMessage>
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

                <FieldDescription>Enter the vehicle capacity.</FieldDescription>

                {form.formState.errors.capacity && (
                  <FormMessage>
                    {form.formState.errors.capacity.message}
                  </FormMessage>
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

                <FieldDescription>Enter the base fare amount.</FieldDescription>

                {form.formState.errors.baseFair && (
                  <FormMessage>
                    {form.formState.errors.baseFair.message}
                  </FormMessage>
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

                <FieldDescription>
                  Enter the minimum fare amount.
                </FieldDescription>

                {form.formState.errors.minFair && (
                  <FormMessage>
                    {form.formState.errors.minFair.message}
                  </FormMessage>
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

                <FieldDescription>
                  Enter the minimum number of hours.
                </FieldDescription>

                {form.formState.errors.minHour && (
                  <FormMessage>
                    {form.formState.errors.minHour.message}
                  </FormMessage>
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

                <FieldDescription>Enter the price per hour.</FieldDescription>

                {form.formState.errors.pricePerHour && (
                  <FormMessage>
                    {form.formState.errors.pricePerHour.message}
                  </FormMessage>
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

                <FieldDescription>Enter the price per mile.</FieldDescription>

                {form.formState.errors.pricePerMile && (
                  <FormMessage>
                    {form.formState.errors.pricePerMile.message}
                  </FormMessage>
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

                <FieldDescription>Enter the price per minute.</FieldDescription>

                {form.formState.errors.pricePerMinute && (
                  <FormMessage>
                    {form.formState.errors.pricePerMinute.message}
                  </FormMessage>
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

                <FieldDescription>
                  Enter the city-to-city hourly rate.
                </FieldDescription>

                {form.formState.errors.cityToCityHourlyRate && (
                  <FormMessage>
                    {form.formState.errors.cityToCityHourlyRate.message}
                  </FormMessage>
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

                <FieldDescription>
                  Enter the vehicle plate number.
                </FieldDescription>

                {form.formState.errors.plateNumber && (
                  <FormMessage>
                    {form.formState.errors.plateNumber.message}
                  </FormMessage>
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

                <FieldDescription>Enter the vehicle brand.</FieldDescription>

                {form.formState.errors.brand && (
                  <FormMessage>
                    {form.formState.errors.brand.message}
                  </FormMessage>
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

                <FieldDescription>Enter the vehicle model.</FieldDescription>

                {form.formState.errors.model && (
                  <FormMessage>
                    {form.formState.errors.model.message}
                  </FormMessage>
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

                <FieldDescription>Enter the vehicle color.</FieldDescription>

                {form.formState.errors.color && (
                  <FormMessage>
                    {form.formState.errors.color.message}
                  </FormMessage>
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
                      value={field?.value?.toString()}
                      setSelectedItem={(val) => field.onChange(Number(val))}
                    />
                  )}
                />

                <FieldDescription>Select the vehicle year.</FieldDescription>

                {form.formState.errors.year && (
                  <FormMessage>
                    {form.formState.errors.year.message}
                  </FormMessage>
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

                <FieldDescription>Select the type of vehicle.</FieldDescription>

                {form.formState.errors.vehicleType && (
                  <FormMessage>
                    {form.formState.errors.vehicleType.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-full">
                <FieldLabel
                  htmlFor="zonePricingEnabled"
                  className="text-base-black gap-0"
                >
                  Zone Pricing
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="zonePricingEnabled"
                  render={({ field }) => (
                    <Checkbox
                      id="zoneToggle"
                      className="w-4 max-w-4"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(val) => {
                        field.onChange(val);
                        if (!val)
                          replaceZonePricings([]); // Clear zone list
                        else if (val && zonePricingsFields.length === 0)
                          appendZonePricings({
                            zoneStart: 0.01,
                            zoneEnd: 10,
                            pricePerMile: 0,
                            pricePerMinute: 0,
                          });
                      }}
                    />
                  )}
                />

                <FieldDescription>
                  Select the zones for which pricing applies.
                </FieldDescription>

                {form.formState.errors.zonePricings && (
                  <FormMessage>
                    {form.formState.errors.zonePricingEnabled.message}
                  </FormMessage>
                )}
              </Field>

              {/* SHOW/HIDE DIV */}
              {form.watch("zonePricingEnabled") && (
                <Field className="col-span-full">
                  <FieldLabel
                    htmlFor="zonePricings"
                    className="text-base-black gap-0 cursor-pointer"
                  >
                    Activate Zone Based Pricing
                  </FieldLabel>
                  <Controller
                    control={form.control}
                    name="zonePricings"
                    render={() => (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="col-span-full p-4 border border-base-gray rounded bg-base-light-gray">
                          {zonePricingsFields?.map((zone, index) => (
                            <Field className="" key={zone.id}>
                              <FieldLabel className="mb-2 text-xl">
                                Zone {index + 1}
                              </FieldLabel>

                              <div className="space-y-4 w-full mb-4">
                                {/* ---- Zone Start ---- */}
                                <Field>
                                  <FieldLabel
                                    htmlFor={`zonePricingsFields.${index}.zoneStart`}
                                  >
                                    Zone Start (mile)
                                  </FieldLabel>

                                  <InputGroup>
                                    <Controller
                                      control={form.control}
                                      name={`zonePricings.${index}.zoneStart`}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          type="number"
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          step="0.01"
                                          {...field}
                                        />
                                      )}
                                    />

                                    {/* optional icon */}
                                    <InputGroupAddon>
                                      <IconRuler />
                                    </InputGroupAddon>
                                  </InputGroup>

                                  <FieldDescription>
                                    Enter the starting mile of the zone.
                                  </FieldDescription>
                                </Field>

                                {/* ---- Zone End ---- */}
                                <Field>
                                  <FieldLabel
                                    htmlFor={`zonePricingsFields${index}.zoneEnd`}
                                  >
                                    Zone End (mile)
                                  </FieldLabel>

                                  <InputGroup>
                                    <Controller
                                      control={form.control}
                                      name={`zonePricings.${index}.zoneEnd`}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          type="number"
                                          step="0.01"
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          max={globalAirportLimit}
                                          {...field}
                                        />
                                      )}
                                    />
                                    <InputGroupAddon>
                                      <IconFlag />
                                    </InputGroupAddon>
                                  </InputGroup>

                                  <FieldDescription>
                                    Enter the ending mile for this zone.
                                  </FieldDescription>
                                </Field>

                                {/* ---- Price Per Mile ---- */}
                                <Field>
                                  <FieldLabel htmlFor={`pricePerMile-${index}`}>
                                    Price per Mile
                                  </FieldLabel>

                                  <InputGroup>
                                    <Controller
                                      control={form.control}
                                      name={`zonePricings.${index}.pricePerMile`}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          type="number"
                                          step="0.01"
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          {...field}
                                        />
                                      )}
                                    />
                                    <InputGroupAddon>
                                      <IconCurrencyDollar />
                                    </InputGroupAddon>
                                  </InputGroup>

                                  <FieldDescription>
                                    Enter the rate per mile.
                                  </FieldDescription>
                                </Field>

                                {/* ---- Price Per Minute ---- */}
                                <Field>
                                  <FieldLabel
                                    htmlFor={`pricePerMinute-${index}`}
                                  >
                                    Price per Minute
                                  </FieldLabel>

                                  <InputGroup>
                                    <Controller
                                      control={form.control}
                                      name={`zonePricings.${index}.pricePerMinute`}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          type="number"
                                          step="0.01"
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          {...field}
                                        />
                                      )}
                                    />
                                    <InputGroupAddon>
                                      <IconTimeDuration0 />
                                    </InputGroupAddon>
                                  </InputGroup>

                                  <FieldDescription>
                                    Enter the rate per minute.
                                  </FieldDescription>
                                </Field>

                                {/* ---- Remove Button ---- */}
                                <Button
                                  type="button"
                                  onClick={() => {
                                    // const newZones = zonePricing.filter(
                                    // 	(_, i) => i !== index,
                                    // );
                                    // setZonePricing(newZones);
                                    removeZonePricings(index);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </Field>
                          ))}

                          <Button
                            type="button"
                            onClick={handleAddZone}
                            // onClick={() => {
                            // 	// if (zonePricing.length === 0) {
                            // 	// 	setZonePricing([
                            // 	// 		{
                            // 	// 			start: 0.01,
                            // 	// 			end: 0,
                            // 	// 			pricePerMile: 0,
                            // 	// 			pricePerDistance: 0,
                            // 	// 		},
                            // 	// 	]);
                            // 	// } else {
                            // 	// 	const lastEnd =
                            // 	// 		zonePricing?.[zonePricing.length - 1].end;
                            // 	// 	if (lastEnd >= globalAirportLimit) {
                            // 	// 		toast({
                            // 	// 			title: "Global Airport Limit",
                            // 	// 			description: `Maximum limit of ${globalAirportLimit} miles reached`,
                            // 	// 			variant: "destructive",
                            // 	// 		});
                            // 	// 		return;
                            // 	// 	}
                            // 	// 	let finalLastEnd = lastEnd + 10;
                            // 	// 	if (finalLastEnd >= globalAirportLimit) {
                            // 	// 		finalLastEnd = globalAirportLimit;
                            // 	// 	}
                            // 	// 	setZonePricing([
                            // 	// 		...zonePricing,
                            // 	// 		{
                            // 	// 			start: 0.01,
                            // 	// 			end: parseInt(finalLastEnd, 10),
                            // 	// 			pricePerMile: 0,
                            // 	// 			pricePerDistance: 0,
                            // 	// 		},
                            // 	// 	]);
                            // 	// }

                            // }}
                          >
                            Add New Zone
                          </Button>

                          {zonePricingsFields.length > 0 && (
                            <Button
                              type="button"
                              onClick={() => replaceZonePricings([])}
                              className="ml-4"
                            >
                              Clear All Zones
                            </Button>
                          )}
                        </div>
                      </div>
                      // </div>
                    )}
                  />
                </Field>
              )}

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
                  <FormMessage>
                    {form.formState.errors.documents.message}
                  </FormMessage>
                )}
              </Field>
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                variant="outlinePrimary"
                type="button"
                onClick={() => {
                  form.reset(defaultFleetFormValues);
                  setPreviews([]);
                }}
              >
                Clear All
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default FleetForm;
