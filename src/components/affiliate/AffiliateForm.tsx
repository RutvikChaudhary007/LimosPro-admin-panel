import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBuilding,
  IconBuildingBridge2,
  IconEye,
  IconId,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { type ChangeEvent, type FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import type { IAffiliate, IEditAffiliateRes } from "@/types/affiliate.type";
import isFieldDisabled from "@/utils/disableFormField";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import FilesUpload from "../ui/upload-files";

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const formSchema = z.object({
  firstName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "First name cannot be empty or just whitespace.",
    })
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Last name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Last name must be at least 3 characters" }),
  businessLocation: z.object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
  businessAddress: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Business Address cannot be empty or just whitespace.",
    })
    .min(3, { message: "Business Address must be at least 3 characters" }),
  companyName: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters" }),
  email: z.email(),
  businessContactNumber: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^[+]?[(]?\d+[)]?[-\s.]?[(]?\d+[)]?[-\s.]?\d+[-\s.]?\d+$/, {
      message: "Invalid phone number format",
    })
    .refine(
      (phone) => {
        // Remove all non-digit characters and check length
        const digitsOnly = phone.replaceAll(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      { message: "Phone number must have 10-15 digits" },
    ),
  entityType: z.string().min(1, { message: "Entity Type is required" }),
  isChauffer: z.boolean(),
  taxId: z.string().min(2, { message: "Tax id is required." }),
  businessEmail: z.email(),
  commissionRate: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Commission rate cannot be empty or just whitespace.",
    })
    .refine((value) => !Number.isNaN(Number(value)), {
      message: "Commission rate must be a valid number.",
    })
    .refine((n) => Number(n) >= 0, { message: "Must be non‑negative" }),
  password: z.string().refine((value) => value.trim() !== "", {
    message: "Password cannot be empty or just whitespace.",
  }),
  documents: z
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
      {
        message: "Select at least 1 file",
      },
    )
    .refine((files) => files.length <= 4, {
      message: "You can upload up to 4 files",
    })
    .refine(
      (files) => {
        // Only check size for actual File objects, not for existing document objects
        const fileObjects = files.filter((f) => f instanceof File);
        return (
          fileObjects.length === 0 ||
          fileObjects.every((f) => f.size <= maxSize)
        );
      },
      {
        message: `Max size ${maxSize / (1024 * 1024)}MB`,
      },
    )
    .refine(
      (files) => {
        // Only check mime types for actual File objects, not for existing document objects
        const fileObjects = files.filter((f) => f instanceof File);
        return (
          fileObjects.length === 0 ||
          fileObjects.every((f) => ALLOWED_MIME_TYPES.includes(f.type))
        );
      },
      {
        message: "Invalid file types detected",
      },
    ),
  // password: z.string().min(10, { message: "Password must be at least 10 characters" }),
  status: z.string().optional(),
  // status: z.union([z.string(), z.literal("")]).optional(),
});

type TAffiliateForm = z.infer<typeof formSchema>;
interface AffiliateFormProps {
  initialData?: IEditAffiliateRes;
  onSubmit: (data: FormData) => void;
  disabledFields?: string[];
  type: string;
}

const showStatus = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
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
  data?: IEditAffiliateRes,
): TAffiliateForm | undefined => {
  if (!data) return undefined;
  // console.log("initial data:", data)

  return {
    firstName: data?.user?.firstName || "",
    lastName: data?.user?.lastName || "",
    email: data?.user?.email || "",
    password: data?.user?.password || "",
    isChauffer: data.isChauffer ?? false,
    companyName: data.companyName || "",
    businessContactNumber: data.businessContactNumber || "",
    businessAddress: data.businessAddress || "",
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
    documents: data.documents || [],
    status: data.status || "",
  };
};

const AffiliateForm: FC<AffiliateFormProps & { businessAddress?: string }> = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
  businessAddress,
}) => {
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

  const [_newAddress, setNewAddress] = useState("");
  const [_addressObj, setAddressObj] = useState<IAddressObj>();
  const [_isAddressValid, setIsAddressValid] = useState(false);
  // const fileRef = useRef<HTMLInputElement | null>(null);

  const [_statusValue, setStatusValue] = useState<{
    status: string;
    entityType: string;
  }>({
    status: "",
    entityType: "",
  });

  const form = useForm<TAffiliateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isChauffer: false,
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
  });
  useEffect(() => {
    if (initialData?.businessAddress) {
      setNewAddress(initialData.businessAddress);
    }
    if (businessAddress) {
      form.setValue("businessAddress", businessAddress);
    }
  }, [initialData, businessAddress, form]);
  // const documents = form.watch("documents");
  const handleFormSubmit = async (values: IAffiliate) => {
    try {
      const formData = new FormData();

      // Append all scalar values
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("companyName", values.companyName);
      formData.append("businessEmail", values.businessEmail);
      formData.append("businessContactNumber", values.businessContactNumber);
      formData.append("businessAddress", values.businessAddress);
      formData.append("entityType", values.entityType);
      formData.append(
        "commissionRate",
        values.commissionRate?.toString() || "0",
      );
      formData.append("status", values.status || "");
      formData.append("isChauffer", values.isChauffer ? "true" : "false");
      formData.append("taxId", values.taxId);
      formData.append(
        "businessLocation",
        JSON.stringify(values.businessLocation),
      );

      // Append files
      values?.documents?.forEach((file) => {
        formData.append(`documents`, file);
      });

      onSubmit(formData);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* Affiliate Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="companyName"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter your registered company name here.
                </FieldDescription>

                {form.formState.errors.companyName && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.companyName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="firstName"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter your given name as it appears on official records.
                </FieldDescription>

                {form.formState.errors.firstName && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="lastName"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter your family or surname as it appears officially.
                </FieldDescription>

                {form.formState.errors.lastName && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-base-black gap-0"
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
                        type="password"
                        placeholder="e.g., mysecretpasswd123"
                        disabled={isFieldDisabled(disabledFields, "password")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconLock />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <IconEye />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Choose a strong password with at least 8 characters.
                </FieldDescription>

                {form.formState.errors.password && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-base-black gap-0">
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

                <FieldDescription className="mt-1">
                  Enter your valid email address for account communication.
                </FieldDescription>

                {form.formState.errors.email && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessContactNumber"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter your business contact number including country code.
                </FieldDescription>

                {form.formState.errors.businessContactNumber && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.businessContactNumber.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessAddress"
                  className="text-base-black gap-0"
                >
                  Company Location
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <div className="w-full">
                      <AddressInput
                        value={field.value}
                        field={field}
                        onChange={(value) => {
                          setNewAddress(value);
                          if (form.formState.errors.businessAddress) {
                            form.clearErrors("businessAddress");
                          }
                          field.onChange(value);
                        }}
                        onUpdate={setAddressObj}
                        onValidityChange={setIsAddressValid}
                        disabled={isFieldDisabled(
                          disabledFields,
                          "businessAddress",
                        )}
                      />
                    </div>
                  )}
                />

                <FieldDescription className="mt-1">
                  Enter your complete business address for verification and
                  contact purposes.
                </FieldDescription>

                {form.formState.errors.businessAddress && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.businessAddress.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="entityType"
                  className="text-base-black gap-0"
                >
                  Entity Type
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="entityType"
                        type="text"
                        placeholder="Corporation"
                        disabled={isFieldDisabled(disabledFields, "entityType")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBuildingBridge2 />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription className="mt-1">
                  Specify your business structure (e.g., Corporation, LLC,
                  Partnership).
                </FieldDescription>

                {form.formState.errors.entityType && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.entityType.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="taxId" className="text-base-black gap-0">
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

                <FieldDescription className="mt-1">
                  Enter your registered tax identification number.
                </FieldDescription>

                {form.formState.errors.taxId && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.taxId.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="commissionRate"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter the commission percentage applicable for this seller.
                </FieldDescription>

                {form.formState.errors.commissionRate && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.commissionRate.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="status" className="text-base-black gap-0">
                  Status
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        // setStatusValue((prev) => ({ ...prev, status: v }));
                      }}
                      disabled={isFieldDisabled(disabledFields, "status")}
                    >
                      <FormControl className="w-full min-w-full rounded">
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {showStatus.map((option) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldDescription className="mt-1">
                  Choose the current operational status for this seller.
                </FieldDescription>

                {form.formState.errors.status && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessEmail"
                  className="text-base-black gap-0"
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

                <FieldDescription className="mt-1">
                  Enter your official business email address.
                </FieldDescription>

                {form.formState.errors.businessEmail && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.businessEmail.message}
                  </p>
                )}
              </Field>

              <Field className="self-end">
                <FieldLabel
                  htmlFor="isChauffer"
                  className="text-base-black gap-0"
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

                      <FieldDescription className="mt-1">
                        Toggle to indicate if the affiliate provides chauffeur
                        services.
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

              <Field>
                <Controller
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FilesUpload
                      title="Upload Documents"
                      accept="image/jpeg,image/png,application/pdf"
                      {...({
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          const newFiles = Array.from(e.target.files ?? []);
                          // Keep existing uploaded documents (with URLs) and add new File objects
                          const existingDocs =
                            field.value?.filter(
                              (doc: File | { url: string }) =>
                                !(doc instanceof File) && doc?.url,
                            ) || [];
                          field.onChange([...existingDocs, ...newFiles]);
                        },
                      } as any)}
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
            <CardFooter>
              <div className="flex items-center justify-start space-x-2.5">
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
                    // form.setValue("documents", []);
                    setStatusValue({ status: "", entityType: "" });
                    // if (fileRef.current) fileRef.current.value = "";
                    setNewAddress("");
                    setAddressObj(undefined);
                    setIsAddressValid(false);
                    // form.reset();
                    // form.setValue("status", "")
                    // form.resetField('documents');
                    // setStatusValue({
                    //     status: "",
                    //     entityType: ""
                    // });
                    // if (fileRef.current) fileRef.current.value = '';
                    // setNewAddress("");
                  }}
                >
                  Clear Alls
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
        {/* <pre>{JSON.stringify(form.watch(),null,2)}</pre> */}
      </form>
    </Form>
  );
};

export default AffiliateForm;
