import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBuilding,
  IconEye,
  IconEyeOff,
  IconId,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { type FC, useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchAllFleets } from "@/api/fleet.api";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import type { IEditPartnerRes } from "@/types/partner/partner.type";
import isFieldDisabled from "@/utils/disableFormField";
import { passwordValidation } from "@/utils/password-validation";
import AddressInput from "../AddressInput";
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
import { Switch } from "../ui/switch";
import FilesUpload from "../ui/upload-files";

const maxSize = 10;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/*"];

const getFormSchema = (isEdit: boolean) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, { message: "First name is required" })
        .refine((value) => value.trim().length >= 3, {
          message: "First name must be at least 3 characters",
        }),
      lastName: z
        .string()
        .min(1, { message: "Last name is required" })
        .refine((value) => value.trim().length >= 3, {
          message: "Last name must be at least 3 characters",
        }),
      businessLocation: z.object({
        latitude: z.number().nullable(),
        longitude: z.number().nullable(),
      }),
      businessAddress: z
        .string()
        .min(1, { message: "Business address is required" })
        .transform((v) => v.trim())
        .refine((value) => value.length >= 3, {
          message: "Business address must be at least 3 characters",
        }),
      companyName: z
        .string()
        .min(1, { message: "Company name is required" })
        .refine((value) => value.trim().length >= 3, {
          message: "Company name must be at least 3 characters",
        }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
      businessContactNumber: z
        .string()
        .min(1, { message: "Business contact number is required" })
        .refine(
          (phone) => {
            const digitsOnly = phone.replaceAll(/\D/g, "");
            return digitsOnly.length >= 10 && digitsOnly.length <= 15;
          },
          { message: "Phone number must be 10–15 digits" },
        )
        .refine(
          (phone) =>
            /^[+]?[(]?\d+[)]?[-\s.]?[(]?\d+[)]?[-\s.]?\d+[-\s.]?\d+$/.test(
              phone.replace(/\s/g, ""),
            ),
          {
            message: "Please enter a valid phone number (e.g. +1 234 567 8900)",
          },
        ),
      entityType: z
        .string()
        .min(1, { message: "Please select an entity type" }),
      isChauffer: z.boolean(),
      // Chauffeur fields - required when isChauffer is true
      licenseNumber: z.string().optional(),
      vehicleId: z.string().uuid().optional(),
      taxId: z
        .string()
        .min(1, { message: "Tax ID is required" })
        .refine((value) => value.trim().length >= 2, {
          message: "Tax ID must be at least 2 characters",
        }),
      businessEmail: z
        .string()
        .min(1, { message: "Business email is required" })
        .email({ message: "Please enter a valid business email address" }),
      commissionRate: z
        .string()
        .min(1, { message: "Commission rate is required" })
        .refine((value) => !Number.isNaN(Number(value)), {
          message: "Commission rate must be a number",
        })
        .refine((value) => Number(value) >= 0, {
          message: "Commission rate must be 0 or greater",
        }),
      password: isEdit
        ? z.union([z.string().length(0), passwordValidation]).optional()
        : passwordValidation,
      documents: isEdit
        ? z.array(z.any())
        : z
            .array(z.any())
            .refine(
              (files) => {
                // If we have existing documents (with url property), they're already validated
                if (files.length > 0 && files.some((file) => file.url)) {
                  return true;
                }

                // For new file uploads, validate length
                return files.length >= 1;
              },
              { message: "Please upload at least one document" },
            )
            .refine((files) => files.length <= 4, {
              message: "You can upload up to 4 files only",
            })
            .refine(
              (files) => {
                const fileObjects = files.filter((f) => f instanceof File);
                return (
                  fileObjects.length === 0 ||
                  fileObjects.every((f) => f.size <= maxSize * 1024 * 1024)
                );
              },
              { message: `Each file must be ${maxSize}MB or less` },
            )
            .refine(
              (files) => {
                const fileObjects = files.filter((f) => f instanceof File);
                return (
                  fileObjects.length === 0 ||
                  fileObjects.every((f) =>
                    ALLOWED_MIME_TYPES.some((allowed) => {
                      if (allowed.endsWith("/*")) {
                        return f.type.startsWith(allowed.replace("/*", ""));
                      }
                      return f.type === allowed;
                    }),
                  )
                );
              },
              { message: "Allowed file types: PDF and images only" },
            ),
      status: z.string().optional(),
    })
    .refine(
      (data) => {
        // If isChauffer is true, licenseNumber is required and must be at least 2 characters
        if (data.isChauffer) {
          return data.licenseNumber && data.licenseNumber.trim().length >= 2;
        }
        return true;
      },
      {
        message:
          "License number is required and must be at least 2 characters when chauffeur is enabled",
        path: ["licenseNumber"],
      },
    )
    .refine(
      (data) => {
        // If isChauffer is true, vehicleId is required
        if (data.isChauffer) {
          return data.vehicleId && data.vehicleId.trim().length > 0;
        }
        return true;
      },
      {
        message: "Vehicle is required when chauffeur is enabled",
        path: ["vehicleId"],
      },
    );

type TPartnerForm = z.infer<ReturnType<typeof getFormSchema>>;
interface PartnerFormProps {
  initialData?: IEditPartnerRes;
  onSubmit: (data: FormData) => Promise<void>;
  disabledFields?: string[];
  type: string;
}

const showStatus = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const entityType = [
  { label: "Sole Proprietorship", value: "sole_proprietorship" },
  { label: "Partnership", value: "partnership" },
  { label: "Limited Partnership (LP)", value: "lp" },
  { label: "Limited Liability Partnership (LLP)", value: "llp" },

  { label: "Limited Liability Company (LLC)", value: "llc" },
  { label: "Private Limited Company (Ltd)", value: "ltd" },
  { label: "Public Limited Company (PLC)", value: "plc" },

  { label: "Corporation (Inc)", value: "inc" },
  { label: "C Corporation (C-Corp)", value: "c_corp" },
  { label: "S Corporation (S-Corp)", value: "s_corp" },

  { label: "Joint Stock Company (JSC)", value: "jsc" },
  { label: "Holding Company", value: "holding_company" },
  { label: "Subsidiary", value: "subsidiary" },

  { label: "Branch Office", value: "branch_office" },
  { label: "Representative Office", value: "representative_office" },

  { label: "Non-Profit Organization (NPO)", value: "npo" },
  { label: "Non-Governmental Organization (NGO)", value: "ngo" },
  { label: "Foundation", value: "foundation" },
];

interface IAddressObj {
  zip: string;
  city: string;
  address: string;
  state: string;
  country: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

const transformInitialData = (
  data?: IEditPartnerRes,
): TPartnerForm | undefined => {
  if (!data) return undefined;
  // console.log("initial data:", data?.businessAddress);
  // console.log("business Location:", data?.businessLocation);
  // console.log("initial status:", data?.status); // Add this debug log

  return {
    firstName: data?.user?.firstName || "",
    lastName: data?.user?.lastName || "",
    email: data?.user?.email || "",
    password: "",
    isChauffer: data.isChauffer ?? false,
    licenseNumber: data?.chauffeurs?.[0]?.licenseNumber || "",
    vehicleId: data?.chauffeurs?.[0]?.vehicleId || "",
    companyName: data.companyName || "",
    businessContactNumber: data.businessContactNumber || "",
    businessAddress: data?.businessAddress || "",
    businessLocation: data.businessLocation || {
      latitude: null,
      longitude: null,
    },
    businessEmail: data.businessEmail || "",
    entityType: data.entityType || "",
    taxId: data.taxId || "",
    commissionRate: data?.commissionRate
      ? Number(data.commissionRate).toString()
      : "0",
    documents: data?.documents || [],
    // Make sure status is properly normalized and matches the select options
    status: data?.status ? data.status.toLowerCase().trim() : "",
  } as TPartnerForm;
};

const PartnerForm: FC<PartnerFormProps & { businessAddress?: string }> = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}) => {
  const isEdit = type === "Edit Partner";
  // console.log("businessAddress:", businessAddress);
  const formatPhoneNumber = (value: string): string => {
    if (!value) return "";

    // Keep the + and all digits
    let input = value.replaceAll(/[^\d+]/g, "");

    // Ensure it starts with +
    if (!input.startsWith("+")) {
      input = `+${input}`;
    }

    // Remove any + after the first one
    input = `+${input.slice(1).replaceAll(/\+/g, "")}`;

    // Extract country code and remaining digits
    const withoutPlus = input.slice(1);

    if (withoutPlus.length === 0) {
      return "+";
    }

    // Detect country code length (1-3 digits typically)
    // For simplicity, assume US/Canada (+1) or other (+XX or +XXX)
    let countryCode = "";
    let phoneDigits = "";

    if (withoutPlus[0] === "1" && withoutPlus.length > 1) {
      // US/Canada format: +1 (XXX) XXX-XXXX
      countryCode = "1";
      phoneDigits = withoutPlus.slice(1, 11); // Max 10 digits after country code

      if (phoneDigits.length === 0) {
        return `+${countryCode} `;
      } else if (phoneDigits.length <= 3) {
        return `+${countryCode} (${phoneDigits}`;
      } else if (phoneDigits.length <= 6) {
        return `+${countryCode} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
      } else {
        return `+${countryCode} (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
      }
    } else {
      // International format: +XX XXXX XXXX or +XXX XXXX XXXX
      // Determine country code (1-3 digits)
      if (withoutPlus.length <= 2) {
        return `+${withoutPlus}`;
      }

      // Try 2-digit country code first, then 3-digit, then 1-digit
      let ccLength = 2;
      if (
        withoutPlus.length > 3 &&
        parseInt(withoutPlus.slice(0, 3), 10) >= 100
      ) {
        ccLength = 3;
      } else if (withoutPlus[0] === "1") {
        ccLength = 1;
      }

      countryCode = withoutPlus.slice(0, ccLength);
      phoneDigits = withoutPlus.slice(ccLength, ccLength + 10);

      if (phoneDigits.length === 0) {
        return `+${countryCode} `;
      } else if (phoneDigits.length <= 4) {
        return `+${countryCode} ${phoneDigits}`;
      } else if (phoneDigits.length <= 7) {
        return `+${countryCode} ${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4)}`;
      } else {
        return `+${countryCode} ${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4, 7)} ${phoneDigits.slice(7)}`;
      }
    }
  };

  const [addressObj, setAddressObj] = useState<IAddressObj>();
  const [showPassword, setShowPassword] = useState(false);

  const passwordPlaceholder = useMemo(() => {
    return isEdit
      ? "Leave blank to keep current password"
      : "e.g., mysecretpasswd123";
  }, [isEdit]);

  const passwordDescription = useMemo(() => {
    return isEdit
      ? "Leave as is to keep current password, or enter a new one to change it"
      : "Choose a strong password with at least 8 characters.";
  }, [isEdit]);

  const schema = useMemo(() => getFormSchema(isEdit), [isEdit]);
  const form = useForm<TPartnerForm>({
    resolver: zodResolver(schema),
    defaultValues: transformInitialData(initialData) ?? {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isChauffer: false,
      licenseNumber: "",
      vehicleId: "",
      companyName: "",
      businessContactNumber: "",
      businessAddress: "",
      businessEmail: "",
      businessLocation: {
        latitude: null,
        longitude: null,
      },
      entityType: "",
      taxId: "",
      commissionRate: "0",
      documents: [],
      status: "",
    },
    mode: "all",
    // reValidateMode: ["onChange", "onSubmit", "onBlur"],
  });

  const { data: fleetData, isFetching: isFleetFetching } = useFetchAllFleets({
    DateRange: {},
    page: 1,
    limit: 100,
  });

  const fleetOptions = useMemo(() => {
    return (
      fleetData?.vehicles?.map(
        (fleet: {
          id: string;
          brand: string;
          model: string;
          plateNumber: string;
        }) => ({
          label: `${fleet.brand} ${fleet.model} - ${fleet.plateNumber}`,
          value: fleet.id,
        }),
      ) || []
    );
  }, [fleetData]);

  const handleAddressChange = useCallback(
    (value: string) => {
      if (form.formState.errors.businessAddress) {
        form.clearErrors("businessAddress");
      }
      form.setValue("businessAddress", value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form],
  );

  const handleFormSubmit = async (values: TPartnerForm) => {
    try {
      const formData = new FormData();
      if (addressObj) {
        console.log("addressObj:", addressObj);
        values.businessLocation = {
          latitude: addressObj?.location.latitude,
          longitude: addressObj?.location.longitude,
        };
      }
      // Append all scalar values
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      // Append password if provided (handles both Create and optional Edit)
      if (values.password && values.password.trim() !== "") {
        formData.append("password", values.password);
      }
      formData.append("companyName", values.companyName);
      formData.append("businessEmail", values.businessEmail);
      formData.append(
        "businessContactNumber",
        values.businessContactNumber.replace(/\D/g, ""),
      );
      formData.append("businessAddress", values.businessAddress);
      formData.append("entityType", values.entityType);
      formData.append(
        "commissionRate",
        values.commissionRate?.toString() || "0",
      );
      formData.append("status", values.status || "");
      formData.append("isChauffer", values.isChauffer ? "true" : "false");
      formData.append("licenseNumber", values.licenseNumber || "");
      formData.append("vehicleId", values.vehicleId || "");
      formData.append("taxId", values.taxId);
      formData.append(
        "businessLocation",
        JSON.stringify(values.businessLocation),
      );

      // Append files
      if (!isEdit) {
        values?.documents?.forEach((file) => {
          formData.append(`documents`, file);
        });
      }

      await onSubmit(formData);
      // form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* Partner Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="companyName"
                  className="gap-0 text-base-black"
                >
                  Company Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="companyName"
                        type="text"
                        placeholder="Company Name"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "companyName",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBuilding />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your registered company name here.
                </FieldDescription>

                {form.formState.errors.companyName && (
                  <FormMessage>
                    {form.formState.errors.companyName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="firstName"
                  className="gap-0 text-base-black"
                >
                  First Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="firstName"
                        type="text"
                        placeholder="e.g., John"
                        disabled={isFieldDisabled(disabledFields, "firstName")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUser />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your given name as it appears on official records.
                </FieldDescription>

                {form.formState.errors.firstName && (
                  <FormMessage>
                    {form.formState.errors.firstName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="lastName"
                  className="gap-0 text-base-black"
                >
                  Last Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="lastName"
                        type="text"
                        placeholder="e.g., Doe"
                        disabled={isFieldDisabled(disabledFields, "lastName")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUser />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your family or surname as it appears officially.
                </FieldDescription>

                {form.formState.errors.lastName && (
                  <FormMessage>
                    {form.formState.errors.lastName.message}
                  </FormMessage>
                )}
              </Field>

              {!isEdit && (
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="gap-0 text-base-black"
                  >
                    Password
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={passwordPlaceholder}
                          disabled={isFieldDisabled(disabledFields, "password")}
                          {...field}
                        />
                        <InputGroupAddon>
                          <IconLock />
                        </InputGroupAddon>
                        <InputGroupAddon
                          align="inline-end"
                          className="cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <IconEyeOff /> : <IconEye />}
                        </InputGroupAddon>
                      </InputGroup>
                    )}
                  />

                  <FieldDescription>{passwordDescription}</FieldDescription>

                  {form.formState.errors.password && (
                    <FormMessage>
                      {form.formState.errors.password.message}
                    </FormMessage>
                  )}
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="gap-0 text-base-black">
                  Email Address
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        disabled={isFieldDisabled(disabledFields, "email")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your valid email address for account communication.
                </FieldDescription>

                {form.formState.errors.email && (
                  <FormMessage>
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessContactNumber"
                  className="gap-0 text-base-black"
                >
                  Phone
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="businessContactNumber"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="businessContactNumber"
                        type="tel"
                        placeholder="+1 (891) 943-9826"
                        value={field.value || ""}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        disabled={isFieldDisabled(
                          disabledFields,
                          "businessContactNumber",
                        )}
                      />
                      <InputGroupAddon>
                        <IconPhone />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your business contact number including country code.
                </FieldDescription>

                {form.formState.errors.businessContactNumber && (
                  <FormMessage>
                    {form.formState.errors.businessContactNumber.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessAddress"
                  className="gap-0 text-base-black"
                >
                  Company Location
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <div className="w-full">
                      <AddressInput
                        value={field.value || ""} // Ensure it's always a string
                        field={field}
                        onChange={handleAddressChange}
                        onUpdate={setAddressObj}
                        disabled={isFieldDisabled(
                          disabledFields,
                          "businessAddress",
                        )}
                      />
                    </div>
                  )}
                />

                <FieldDescription>
                  Enter your complete business address for verification and
                  contact purposes.
                </FieldDescription>

                {form.formState.errors.businessAddress && (
                  <FormMessage>
                    {form.formState.errors.businessAddress.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="entityType"
                  className="gap-0 text-base-black"
                >
                  Entity Type
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Entity Type"
                      items={
                        entityType?.map((a) => ({
                          label: a.label,
                          value: a.value,
                        })) || []
                      }
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                    />
                  )}
                />

                <FieldDescription>
                  Specify your business structure (e.g., Corporation, LLC,
                  Partnership).
                </FieldDescription>

                {form.formState.errors.entityType && (
                  <FormMessage>
                    {form.formState.errors.entityType.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="taxId" className="gap-0 text-base-black">
                  Tax ID
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="taxId"
                        type="text"
                        placeholder="900-70-0000"
                        disabled={isFieldDisabled(disabledFields, "taxId")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconId />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your registered tax identification number.
                </FieldDescription>

                {form.formState.errors.taxId && (
                  <FormMessage>
                    {form.formState.errors.taxId.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="commissionRate"
                  className="gap-0 text-base-black"
                >
                  Commission Rate
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="commissionRate"
                        type="number"
                        placeholder="12"
                        min="0"
                        step="0.01"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "commissionRate",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <span className="text-base font-semibold">%</span>
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter the commission percentage applicable for this seller.
                </FieldDescription>

                {form.formState.errors.commissionRate && (
                  <FormMessage>
                    {form.formState.errors.commissionRate.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="status" className="gap-0 text-base-black">
                  Status
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Status"
                      items={
                        showStatus?.map((a) => ({
                          label: a.label,
                          value: a.value,
                        })) || []
                      }
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                    />
                  )}
                />

                <FieldDescription>
                  Choose the current operational status for this seller.
                </FieldDescription>

                {form.formState.errors.status && (
                  <FormMessage>
                    {form.formState.errors.status.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessEmail"
                  className="gap-0 text-base-black"
                >
                  Business Email
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="businessEmail"
                        type="email"
                        placeholder="Business Email"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "businessEmail",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your official business email address.
                </FieldDescription>

                {form.formState.errors.businessEmail && (
                  <FormMessage>
                    {form.formState.errors.businessEmail.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="self-center">
                <FieldLabel
                  htmlFor="isChauffer"
                  className="gap-0 text-base-black"
                >
                  Chauffeur
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="isChauffer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          id="isChauffer"
                          checked={!!field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          disabled={isFieldDisabled(
                            disabledFields,
                            "isChauffer",
                          )}
                          size="md"
                        />
                      </FormControl>

                      <FieldDescription>
                        Toggle to enable chauffeur privileges.
                      </FieldDescription>

                      <FieldDescription
                        className={`mt-1${
                          form.formState.errors.isChauffer
                            ? "visible text-base-danger"
                            : "invisible"
                        }`}
                      >
                        {form.formState.errors.isChauffer?.message}
                      </FieldDescription>
                    </FormItem>
                  )}
                />
              </Field>

              {/* License Number field - shown when isChauffer is true */}
              {form.watch("isChauffer") && (
                <Field>
                  <FieldLabel
                    htmlFor="licenseNumber"
                    className="gap-0 text-base-black"
                  >
                    License Number *
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupInput
                          id="licenseNumber"
                          type="text"
                          placeholder="e.g., DL123456"
                          disabled={isFieldDisabled(
                            disabledFields,
                            "licenseNumber",
                          )}
                          {...field}
                        />
                        <InputGroupAddon>
                          <IconId />
                        </InputGroupAddon>
                      </InputGroup>
                    )}
                  />

                  <FieldDescription>
                    Enter the chauffeur's driving license number (required when
                    chauffeur is enabled).
                  </FieldDescription>

                  {form.formState.errors.licenseNumber && (
                    <FormMessage>
                      {form.formState.errors.licenseNumber.message}
                    </FormMessage>
                  )}
                </Field>
              )}

              {/* Vehicle ID field - shown when isChauffer is true - REQUIRED with dropdown */}
              {form.watch("isChauffer") && (
                <Field>
                  <FieldLabel
                    htmlFor="vehicleId"
                    className="gap-0 text-base-black"
                  >
                    Vehicle *
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                      <SelectDropDown
                        placeholder={
                          isFleetFetching
                            ? "Loading vehicles..."
                            : "Select Vehicle"
                        }
                        items={fleetOptions}
                        value={field.value || ""}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )}
                  />

                  <FieldDescription>
                    Select the vehicle to assign to this chauffeur (required).
                  </FieldDescription>

                  {form.formState.errors.vehicleId && (
                    <FormMessage>
                      {form.formState.errors.vehicleId.message}
                    </FormMessage>
                  )}
                </Field>
              )}

              <Field className="col-span-2">
                <Controller
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FilesUpload
                      title="Upload Documents"
                      accept={ALLOWED_MIME_TYPES.join()}
                      maxSize={maxSize}
                      value={field.value ?? []}
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
                variant={"outlinePrimary"}
                type="button"
                onClick={() => {
                  form.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    isChauffer: false,
                    licenseNumber: "",
                    vehicleId: "",
                    companyName: "",
                    businessContactNumber: "",
                    businessAddress: "",
                    businessEmail: "",
                    businessLocation: { latitude: 0, longitude: 0 },
                    entityType: "",
                    taxId: "",
                    commissionRate: "",
                    documents: [],
                    status: "",
                  });
                  setAddressObj(undefined);
                }}
              >
                Clear All
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
        {/* <pre>{JSON.stringify(form.watch(),null,2)}</pre> */}
      </form>
    </Form>
  );
};

export default PartnerForm;
