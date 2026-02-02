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

const formSchema = z.object({
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
  capacity: z
    .string()
    .min(1, { message: "Capacity  is required" })
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
  };

  return {
    ...base,
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
  vehicleImages: [] as unknown as FileList,
  status: "",
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

  useEffect(() => {
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
                <Controller
                  control={form.control}
                  name="vehicleImages"
                  render={({ field }) => (
                    <FilesUpload
                      title="Upload Vehicle Image"
                      accept="image/jpeg,image/png,application/pdf"
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
                  <FormMessage>
                    {form.formState.errors.vehicleImages.message}
                  </FormMessage>
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
