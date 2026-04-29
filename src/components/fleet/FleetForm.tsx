// @ts-nocheck

import {
  IconBrand4chan,
  IconCar,
  IconCreditCard,
  IconPackage,
  IconPalette,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import { useFetchVehicleTypes } from "@/api/vehicleType.api";
import { Form, FormMessage } from "@/components/ui/form";
import { useUserStore } from "@/stores/useAuthStore";
import type { IFleetFormProps } from "@/types/fleet.type";
import isFieldDisabled from "@/utils/disableFormField";
import { safeZodResolver } from "@/utils/safeZodResolver";
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
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SelectDropDown } from "../ui/select";
import FilesUpload from "../ui/upload-files";

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
  year: z.number(),
  // name: z.string().refine(value => value.trim() !== "", {
  //     message: "Fleet name cannot be empty or just whitespace.",
  // }).min(3, { message: "Fleet name must be at least 3 characters" }),
  // description: z
  //   .string()
  //   .refine((value) => value.trim() !== "", {
  //     message: "Description  cannot be empty or just whitespace.",
  //   })
  //   .min(3, { message: "Description  must be at least 3 characters" }),
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
  regionId: z.string().optional(),
  partnerId: z.string().optional(),
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
    .union([z.string(), z.number()])
    .refine((v) => v !== "" && v !== undefined && v !== null, {
      message: "Capacity is required",
    })
    .transform((v) => Number(v))
    .refine((n) => !Number.isNaN(n) && n >= 0, {
      message: "Capacity must be a non-negative number",
    }),
  vehicleType: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Vehicle type  cannot be empty or just whitespace.",
    })
    .min(3, { message: "Vehicle type must be at least 3 characters" }),
  bagsCapacity: z
    .union([z.string(), z.number()])
    .transform((v) => String(v ?? ""))
    .refine((value) => value.trim() !== "", {
      message: "Bags capacity cannot be empty.",
    }),
  vehicleImages: z
    .union([
      z.custom<FileList>(),
      z.array(z.instanceof(File)),
      z.array(z.any()),
    ])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return [];
      if (v instanceof FileList) return Array.from(v);
      return Array.isArray(v) ? v : [];
    })
    .refine((arr) => arr.length <= 4, {
      message: "You can upload up to 4 files",
    })
    .refine((arr) => arr.every((f) => f instanceof File && f.size <= maxSize), {
      message: `Max file size ${maxSize / (1024 * 1024)}MB`,
    })
    .refine(
      (arr) =>
        arr.length === 0 ||
        arr.every(
          (f) => f instanceof File && ALLOWED_MIME_TYPES.includes(f.type),
        ),
      { message: "Only JPEG and PNG images are allowed" },
    ),
  documents: z.array(z.any()).optional(),
  status: z.string().optional(),
});

export type TFleetForm = z.infer<typeof formSchema>;

const transformInitialData = (data?: TFleetForm): TFleetForm | undefined => {
  if (!data) return undefined;
  styledLog(data, "transform data:", "alert");
  const base = {
    regionId: data?.servicePricings?.[0]?.region?.id || "",
    // description: data?.servicePricings?.[0]?.description || "",
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
  // description: "",
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
  const [previews, setPreviews] = useState<string[]>([]);
  const { data: vehicleTypeData } = useFetchVehicleTypes(true);
  const vehicleTypeOptions = vehicleTypeData?.items || [];
  const years = Array.from({ length: 200 }, (_, i) => 1900 + i);

  const form = useForm<TFleetForm>({
    resolver: safeZodResolver(formSchema),
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
    // Only admins must select region and partner; partners use their own context
    if (!isPartner) {
      if (!data.regionId?.trim()) {
        form.setError("regionId", {
          type: "manual",
          message: "Region is required",
        });
        return;
      }
      if (!data.partnerId?.trim()) {
        form.setError("partnerId", {
          type: "manual",
          message: "Partner is required",
        });
        return;
      }
    }

    // Require at least one vehicle image when creating (edit can keep existing images)
    const vehicleFiles = data?.vehicleImages ?? [];
    const hasNewImages =
      Array.isArray(vehicleFiles) &&
      vehicleFiles.some((f) => f instanceof File);
    if (!initialData && !hasNewImages) {
      form.setError("vehicleImages", {
        type: "manual",
        message: "Select at least 1 vehicle image",
      });
      return;
    }

    const formData = new FormData();

    formData.append("partnerId", data?.partnerId);
    // regionId is needed in create flow; update API currently rejects it
    if (!initialData && data?.regionId) {
      formData.append("regionId", data.regionId);
    }
    formData.append("bagsCapacity", data?.bagsCapacity);
    formData.append("brand", data?.brand);
    formData.append("model", data?.model);
    formData.append("capacity", data?.capacity);
    formData.append("color", data?.color);
    // formData.append("description", data?.description);
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

  const handleInvalidSubmit = (errors: FieldErrors<TFleetForm>) => {
    const firstErrorField = Object.keys(errors)[0] as
      | keyof TFleetForm
      | undefined;
    if (!firstErrorField) return;

    const selector = `#${String(firstErrorField)}, [name="${String(firstErrorField)}"]`;
    const fieldElement = document.querySelector(selector);

    if (fieldElement && "scrollIntoView" in fieldElement) {
      fieldElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit, handleInvalidSubmit)}>
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
                  className="gap-0 text-base-black"
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
                        disabled={
                          isPartner ||
                          isFieldDisabled(disabledFields, "regionId")
                        }
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
                  className="gap-0 text-base-black"
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

              {/* <Field>
                <FieldLabel
                  htmlFor="description"
                  className="gap-0 text-base-black"
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
              </Field> */}

              <Field>
                <FieldLabel
                  htmlFor="bagsCapacity"
                  className="gap-0 text-base-black"
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
                  className="gap-0 text-base-black"
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
                  className="gap-0 text-base-black"
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
                <FieldLabel htmlFor="brand" className="gap-0 text-base-black">
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
                <FieldLabel htmlFor="model" className="gap-0 text-base-black">
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
                        <IconCar />
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
                <FieldLabel htmlFor="color" className="gap-0 text-base-black">
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
                <FieldLabel htmlFor="year" className="gap-0 text-base-black">
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
                  className="gap-0 text-base-black"
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
                        vehicleTypeOptions?.map((option) => ({
                          label: option.name,
                          value: option.name,
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
