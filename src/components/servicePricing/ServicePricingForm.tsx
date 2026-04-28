// @ts-nocheck

import {
  IconBuilding,
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconFileText,
  IconFlag,
  IconInfoCircle,
  IconMapPin,
  IconRuler,
  IconTimeDuration0,
  IconTruck,
} from "@tabler/icons-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form, FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IServicePricingFormProps } from "@/types/servicePricing/servicePricing.type";
import isFieldDisabled from "@/utils/disableFormField";
import { safeZodResolver } from "@/utils/safeZodResolver";
import { Checkbox } from "../ui/checkbox";

const zonePricingSchema = z.discriminatedUnion("zonePricingEnabled", [
  z.object({
    zonePricingEnabled: z.literal(true),
    zonePricings: z
      .array(
        z
          .object({
            zoneStart: z.coerce
              .number({ invalid_type_error: "Zone start must be a number" })
              .gt(0, { message: "Zone start must be greater than 0" }),
            zoneEnd: z.coerce
              .number({ invalid_type_error: "Zone end must be a number" })
              .gt(0, { message: "Zone end must be greater than 0" }),
            pricePerMile: z.coerce
              .number({ invalid_type_error: "Price per mile must be a number" })
              .min(0, { message: "Price per mile must be non-negative" }),
            pricePerMinute: z.coerce
              .number({
                invalid_type_error: "Price per minute must be a number",
              })
              .min(0, { message: "Price per minute must be non-negative" }),
          })
          .refine((data) => data.zoneEnd > data.zoneStart, {
            message: "Zone end must be greater than zone start",
            path: ["zoneEnd"],
          }),
      )
      .min(1, {
        message: "At least one zone is required when zone pricing is enabled",
      }),
  }),
  z.object({ zonePricingEnabled: z.literal(false) }),
]);

// Zod schema for service pricing form
const servicePricingSchema = z
  .object({
    regionId: z.string().min(1, { message: "Region is required" }),
    country: z
      .string()
      .min(2, { message: "Country must be at least 2 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    serviceType: z.string().min(1, { message: "Service type is required" }),
    vehicleId: z.string().min(1, { message: "Vehicle is required" }),
    ratePerHour: z
      .string()
      .min(1, { message: "Rate per hour is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    minHours: z
      .string()
      .min(1, { message: "Minimum hours is required" })
      .regex(/^\d+$/, { message: "Must be a whole number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    extraTime: z
      .string()
      .min(1, { message: "Extra time is required" })
      .regex(/^\d+$/, { message: "Must be a whole number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    basePrice: z
      .string()
      .min(1, { message: "Base price is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    minimumFare: z
      .string()
      .min(1, { message: "Minimum fare is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    cityToCityHourlyRate: z
      .string()
      .min(1, { message: "City to city hourly rate is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    pricePerMile: z
      .string()
      .min(1, { message: "Price per mile is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    pricePerMinute: z
      .string()
      .min(1, { message: "Price per minute is required" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Must be a valid number" })
      .transform((v) => Number(v))
      .refine((n) => n >= 0, { message: "Must be non-negative" }),
    //   zonePricingEnabled: z.boolean().default(false),
    rateValidFrom: z
      .string()
      .min(1, { message: "Valid from date is required" }),
    rateValidTo: z.string().min(1, { message: "Valid to date is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    pricingLevel: z.string().min(1, { message: "Pricing level is required" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    // Metadata fields
    peakHours: z.string().optional(),
    surgeMultiplier: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : undefined)),
    minimumDistance: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : undefined)),
  })
  .and(zonePricingSchema);

export type TServicePricingForm = z.infer<typeof servicePricingSchema>;

const serviceTypeOptions = [
  { label: "City to City", value: "CityToCity" },
  { label: "Hourly", value: "Hourly" },
  { label: "Airport Transfer", value: "AirportTransfer" },
  //   { label: "Point to Point", value: "PointToPoint" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Expired", value: "Expired" },
];

const pricingLevelOptions = [
  { label: "City Level", value: "CityLevel" },
  //   { label: "GlobalFallback Level", value: "GlobalFallback" },
  { label: "Country Level", value: "CountryLevel" },
  { label: "Airport Specific", value: "AirportSpecific" },
  { label: "Exact Route", value: "ExactRoute" },
];

const transformInitialData = (
  data?: TServicePricingForm,
): TServicePricingForm | undefined => {
  if (!data) return undefined;

  const zonePricing = data?.zonePricingEnabled
    ? {
        zonePricingEnabled: true,
        zonePricings:
          data?.zonePricings?.map((zone) => ({
            zoneStart:
              typeof zone.zoneStart === "number"
                ? zone.zoneStart
                : Number(zone.zoneStart) || 0,
            zoneEnd:
              typeof zone.zoneEnd === "number"
                ? zone.zoneEnd
                : Number(zone.zoneEnd) || 0,
            pricePerMile:
              typeof zone.pricePerMile === "number"
                ? zone.pricePerMile
                : Number(zone.pricePerMile) || 0,
            pricePerMinute:
              typeof zone.pricePerMinute === "number"
                ? zone.pricePerMinute
                : Number(zone.pricePerMinute) || 0,
          })) ?? [],
      }
    : {
        zonePricingEnabled: false,
        zonePricings: [],
      };
  return {
    regionId: data?.region?.id || data?.regionId || "",
    country: data?.country || "",
    city: data?.city || "",
    serviceType: data?.serviceType || "",
    vehicleId: data?.vehicle?.id || data?.vehicleId || "",
    ratePerHour: data?.ratePerHour?.toString() || "0",
    minHours: data?.minHours?.toString() || "0",
    extraTime: data?.extraTime?.toString() || "0",
    basePrice: data?.basePrice?.toString() || "0",
    minimumFare: data?.minimumFare?.toString() || "0",
    cityToCityHourlyRate: data?.cityToCityHourlyRate?.toString() || "0",
    pricePerMile: data?.pricePerMile?.toString() || "0",
    pricePerMinute: data?.pricePerMinute?.toString() || "0",
    // zonePricingEnabled: data?.zonePricingEnabled || false,
    rateValidFrom: data?.rateValidFrom || "",
    rateValidTo: data?.rateValidTo || "",
    status: data?.status || "",
    pricingLevel: data?.pricingLevel || "",
    description: data?.description || "",
    peakHours: data?.metadata?.peakHours,
    surgeMultiplier: data?.metadata?.surgeMultiplier?.toString(),
    minimumDistance: data?.metadata?.minimumDistance?.toString(),
    ...zonePricing,
  };
};

const defaultFormValues: TServicePricingForm = {
  regionId: "",
  country: "",
  city: "",
  serviceType: "",
  vehicleId: "",
  ratePerHour: "0",
  minHours: "0",
  extraTime: "0",
  basePrice: "0",
  minimumFare: "0",
  cityToCityHourlyRate: "0",
  pricePerMile: "0",
  pricePerMinute: "0",
  zonePricingEnabled: false,
  rateValidFrom: "",
  rateValidTo: "",
  status: "",
  pricingLevel: "",
  description: "",
  // peakHours: "",
  // surgeMultiplier: "",
  // minimumDistance: "",
};

function ServicePricingForm({
  initialData,
  isVehicleFetching,
  isRegionFetching,
  vehicleData,
  RegionData,
  onSubmit,
  disabledFields,
  type,
}: IServicePricingFormProps) {
  const [globalAirportLimit, _setGlobalAirportLimit] = useState("65");
  const form = useForm<TServicePricingForm>({
    resolver: safeZodResolver(servicePricingSchema),
    defaultValues: transformInitialData(initialData) || defaultFormValues,
    mode: "all",
  });

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

  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: TServicePricingForm) => {
    const {
      peakHours,
      surgeMultiplier,
      minimumDistance,
      metadata: _unusedMetadata,
      ...payload
    } = data as TServicePricingForm & { metadata?: Record<string, unknown> };

    const metadata: Record<string, unknown> = {};

    if (typeof peakHours === "string" && peakHours.trim() !== "") {
      metadata.peakHours = peakHours.trim();
    }
    if (surgeMultiplier !== undefined && surgeMultiplier !== null) {
      metadata.surgeMultiplier = Number(surgeMultiplier);
    }
    if (minimumDistance !== undefined && minimumDistance !== null) {
      metadata.minimumDistance = Number(minimumDistance);
    }

    const finalPayload =
      Object.keys(metadata).length > 0 ? { ...payload, metadata } : payload;

    await onSubmit(finalPayload as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              {/* Region Selection */}
              <Field>
                <FieldLabel
                  htmlFor="regionId"
                  className="text-base-black gap-0"
                >
                  Region *
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
                            label: r.regionName,
                            value: r.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                        disabled={isFieldDisabled(disabledFields, "regionId")}
                      />
                    )
                  }
                />
                <FieldDescription>
                  Select the region for pricing
                </FieldDescription>
                {form.formState.errors.regionId && (
                  <FormMessage>
                    {form.formState.errors.regionId.message}
                  </FormMessage>
                )}
              </Field>

              {/* Country */}
              <Field>
                <FieldLabel htmlFor="country" className="text-base-black gap-0">
                  Country *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="country"
                        type="text"
                        placeholder="United States"
                        disabled={isFieldDisabled(disabledFields, "country")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMapPin />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter the country name</FieldDescription>
                {form.formState.errors.country && (
                  <FormMessage>
                    {form.formState.errors.country.message}
                  </FormMessage>
                )}
              </Field>

              {/* City */}
              <Field>
                <FieldLabel htmlFor="city" className="text-base-black gap-0">
                  City *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="city"
                        type="text"
                        placeholder="New York"
                        disabled={isFieldDisabled(disabledFields, "city")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBuilding />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter the city name</FieldDescription>
                {form.formState.errors.city && (
                  <FormMessage>
                    {form.formState.errors.city.message}
                  </FormMessage>
                )}
              </Field>

              {/* Service Type */}
              <Field>
                <FieldLabel
                  htmlFor="serviceType"
                  className="text-base-black gap-0"
                >
                  Service Type *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Service Type"
                      items={serviceTypeOptions}
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                      disabled={isFieldDisabled(disabledFields, "serviceType")}
                    />
                  )}
                />
                <FieldDescription>Select the service type</FieldDescription>
                {form.formState.errors.serviceType && (
                  <FormMessage>
                    {form.formState.errors.serviceType.message}
                  </FormMessage>
                )}
              </Field>

              {/* Vehicle Selection */}
              <Field>
                <FieldLabel
                  htmlFor="vehicleId"
                  className="text-base-black gap-0"
                >
                  Vehicle *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) =>
                    isVehicleFetching ? (
                      <Spinner />
                    ) : (
                      <SelectDropDown
                        placeholder="Select Vehicle"
                        items={
                          vehicleData?.vehicles?.map((v) => ({
                            label:
                              `${v.brand || ""} ${v.model || ""} - ${v.vehicleType}`.trim(),
                            value: v.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                        disabled={isFieldDisabled(disabledFields, "vehicleId")}
                      />
                    )
                  }
                />
                <FieldDescription>Select the vehicle</FieldDescription>
                {form.formState.errors.vehicleId && (
                  <FormMessage>
                    {form.formState.errors.vehicleId.message}
                  </FormMessage>
                )}
              </Field>

              {/* Rate Per Hour */}
              <Field>
                <FieldLabel
                  htmlFor="ratePerHour"
                  className="text-base-black gap-0"
                >
                  Rate Per Hour *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="ratePerHour"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="ratePerHour"
                        type="number"
                        step="0.01"
                        placeholder="75.50"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "ratePerHour",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter the rate per hour</FieldDescription>
                {form.formState.errors.ratePerHour && (
                  <FormMessage>
                    {form.formState.errors.ratePerHour.message}
                  </FormMessage>
                )}
              </Field>

              {/* Minimum Hours */}
              <Field>
                <FieldLabel
                  htmlFor="minHours"
                  className="text-base-black gap-0"
                >
                  Minimum Hours *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="minHours"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="minHours"
                        type="number"
                        placeholder="2"
                        disabled={isFieldDisabled(disabledFields, "minHours")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconClock />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>
                  Enter minimum hours required
                </FieldDescription>
                {form.formState.errors.minHours && (
                  <FormMessage>
                    {form.formState.errors.minHours.message}
                  </FormMessage>
                )}
              </Field>

              {/* Extra Time */}
              <Field>
                <FieldLabel
                  htmlFor="extraTime"
                  className="text-base-black gap-0"
                >
                  Extra Time (minutes) *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="extraTime"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="extraTime"
                        type="number"
                        placeholder="15"
                        disabled={isFieldDisabled(disabledFields, "extraTime")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconClock />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter extra time in minutes</FieldDescription>
                {form.formState.errors.extraTime && (
                  <FormMessage>
                    {form.formState.errors.extraTime.message}
                  </FormMessage>
                )}
              </Field>

              {/* Base Price */}
              <Field>
                <FieldLabel
                  htmlFor="basePrice"
                  className="text-base-black gap-0"
                >
                  Base Price *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="basePrice"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        disabled={isFieldDisabled(disabledFields, "basePrice")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter the base price</FieldDescription>
                {form.formState.errors.basePrice && (
                  <FormMessage>
                    {form.formState.errors.basePrice.message}
                  </FormMessage>
                )}
              </Field>

              {/* Minimum Fare */}
              <Field>
                <FieldLabel
                  htmlFor="minimumFare"
                  className="text-base-black gap-0"
                >
                  Minimum Fare *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="minimumFare"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="minimumFare"
                        type="number"
                        step="0.01"
                        placeholder="40.00"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "minimumFare",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter the minimum fare</FieldDescription>
                {form.formState.errors.minimumFare && (
                  <FormMessage>
                    {form.formState.errors.minimumFare.message}
                  </FormMessage>
                )}
              </Field>

              {/* City to City Hourly Rate */}
              <Field>
                <FieldLabel
                  htmlFor="cityToCityHourlyRate"
                  className="text-base-black gap-0"
                >
                  City to City Hourly Rate *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="cityToCityHourlyRate"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="cityToCityHourlyRate"
                        type="number"
                        step="0.01"
                        placeholder="85.00"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "cityToCityHourlyRate",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>
                  Enter city to city hourly rate
                </FieldDescription>
                {form.formState.errors.cityToCityHourlyRate && (
                  <FormMessage>
                    {form.formState.errors.cityToCityHourlyRate.message}
                  </FormMessage>
                )}
              </Field>

              {/* Price Per Mile */}
              <Field>
                <FieldLabel
                  htmlFor="pricePerMile"
                  className="text-base-black gap-0"
                >
                  Price Per Mile *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="pricePerMile"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pricePerMile"
                        type="number"
                        step="0.01"
                        placeholder="2.50"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "pricePerMile",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter price per mile</FieldDescription>
                {form.formState.errors.pricePerMile && (
                  <FormMessage>
                    {form.formState.errors.pricePerMile.message}
                  </FormMessage>
                )}
              </Field>

              {/* Price Per Minute */}
              <Field>
                <FieldLabel
                  htmlFor="pricePerMinute"
                  className="text-base-black gap-0"
                >
                  Price Per Minute *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="pricePerMinute"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pricePerMinute"
                        type="number"
                        step="0.01"
                        placeholder="0.50"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "pricePerMinute",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter price per minute</FieldDescription>
                {form.formState.errors.pricePerMinute && (
                  <FormMessage>
                    {form.formState.errors.pricePerMinute.message}
                  </FormMessage>
                )}
              </Field>

              {/* Rate Valid From */}
              <Field>
                <FieldLabel
                  htmlFor="rateValidFrom"
                  className="text-base-black gap-0"
                >
                  Valid From *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="rateValidFrom"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="rateValidFrom"
                        type="date"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "rateValidFrom",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCalendar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Select the start date</FieldDescription>
                {form.formState.errors.rateValidFrom && (
                  <FormMessage>
                    {form.formState.errors.rateValidFrom.message}
                  </FormMessage>
                )}
              </Field>

              {/* Rate Valid To */}
              <Field>
                <FieldLabel
                  htmlFor="rateValidTo"
                  className="text-base-black gap-0"
                >
                  Valid To *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="rateValidTo"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="rateValidTo"
                        type="date"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "rateValidTo",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconCalendar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Select the end date</FieldDescription>
                {form.formState.errors.rateValidTo && (
                  <FormMessage>
                    {form.formState.errors.rateValidTo.message}
                  </FormMessage>
                )}
              </Field>

              {/* Status */}
              <Field>
                <FieldLabel htmlFor="status" className="text-base-black gap-0">
                  Status *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Status"
                      items={statusOptions}
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                      disabled={isFieldDisabled(disabledFields, "status")}
                    />
                  )}
                />
                <FieldDescription>Select pricing status</FieldDescription>
                {form.formState.errors.status && (
                  <FormMessage>
                    {form.formState.errors.status.message}
                  </FormMessage>
                )}
              </Field>

              {/* Pricing Level */}
              <Field>
                <FieldLabel
                  htmlFor="pricingLevel"
                  className="text-base-black gap-0"
                >
                  Pricing Level *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="pricingLevel"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Pricing Level"
                      items={pricingLevelOptions}
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                      disabled={isFieldDisabled(disabledFields, "pricingLevel")}
                    />
                  )}
                />
                <FieldDescription>Select the pricing level</FieldDescription>
                {form.formState.errors.pricingLevel && (
                  <FormMessage>
                    {form.formState.errors.pricingLevel.message}
                  </FormMessage>
                )}
              </Field>

              {/* Description */}
              <Field className="col-span-full">
                <FieldLabel
                  htmlFor="description"
                  className="text-base-black gap-0"
                >
                  Description *
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      placeholder="Premium hourly pricing for New York city services"
                      disabled={isFieldDisabled(disabledFields, "description")}
                      {...field}
                    />
                  )}
                />
                <FieldDescription>
                  Enter a detailed description
                </FieldDescription>
                {form.formState.errors.description && (
                  <FormMessage>
                    {form.formState.errors.description.message}
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

                {form.formState.errors.zonePricingEnabled && (
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
                                  {form.formState.errors.zonePricings?.[index]
                                    ?.zoneStart && (
                                    <FormMessage>
                                      {
                                        form.formState.errors.zonePricings[
                                          index
                                        ].zoneStart.message
                                      }
                                    </FormMessage>
                                  )}
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

                                  {form.formState.errors.zonePricings?.[index]
                                    ?.zoneEnd && (
                                    <FormMessage>
                                      {
                                        form.formState.errors.zonePricings[
                                          index
                                        ].zoneEnd.message
                                      }
                                    </FormMessage>
                                  )}
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
                                  {form.formState.errors.zonePricings?.[index]
                                    ?.pricePerMile && (
                                    <FormMessage>
                                      {
                                        form.formState.errors.zonePricings[
                                          index
                                        ].pricePerMile.message
                                      }
                                    </FormMessage>
                                  )}
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
                                  {form.formState.errors.zonePricings?.[index]
                                    ?.pricePerMinute && (
                                    <FormMessage>
                                      {
                                        form.formState.errors.zonePricings[
                                          index
                                        ].pricePerMinute.message
                                      }
                                    </FormMessage>
                                  )}
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

                          <Button type="button" onClick={handleAddZone}>
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

              {/* Metadata Section */}
              <Field className="col-span-full">
                <FieldLabel className="text-base-black gap-0 text-lg font-semibold">
                  Metadata (Optional)
                </FieldLabel>
              </Field>

              {/* Peak Hours */}
              <Field>
                <FieldLabel
                  htmlFor="peakHours"
                  className="text-base-black gap-0"
                >
                  Peak Hours
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="peakHours"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="peakHours"
                        type="text"
                        placeholder="9AM-5PM"
                        disabled={isFieldDisabled(disabledFields, "peakHours")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconClock />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>Enter peak hours (optional)</FieldDescription>
              </Field>

              {/* Surge Multiplier */}
              <Field>
                <FieldLabel
                  htmlFor="surgeMultiplier"
                  className="text-base-black gap-0"
                >
                  Surge Multiplier
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="surgeMultiplier"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="surgeMultiplier"
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "surgeMultiplier",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconInfoCircle />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>
                  Enter surge multiplier (optional)
                </FieldDescription>
              </Field>

              {/* Minimum Distance */}
              <Field>
                <FieldLabel
                  htmlFor="minimumDistance"
                  className="text-base-black gap-0"
                >
                  Minimum Distance
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="minimumDistance"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="minimumDistance"
                        type="number"
                        placeholder="5"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "minimumDistance",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconTruck />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                <FieldDescription>
                  Enter minimum distance (optional)
                </FieldDescription>
              </Field>
            </CardContent>

            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                variant="outlinePrimary"
                type="button"
                onClick={() => form.reset(defaultFormValues)}
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
}

export default ServicePricingForm;
