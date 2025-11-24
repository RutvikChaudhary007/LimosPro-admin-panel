//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCreditCard,
  IconEye,
  IconId,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { DollarSign } from "lucide-react";
import { type FC, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import useFetchAllFleets from "@/api/getAllFleets.api";
import { Form } from "@/components/ui/form";
import type { IChauffeurFormProps } from "@/types/chauffeur.type";
import isFieldDisabled from "@/utils/disableFormField";
import AddressInput from "../AddressInput";
import { Spinner } from "../Spinner";
import type { TChauffeur } from "../table/column";
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

const statusValues = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];
const maxSize = 10;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/*"];

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
  // location: z.object({
  //     latitude: z.number(),
  //     longitude: z.number(),
  // }),
  businessAddress: z.union([
    z
      .string()
      .trim()
      // .refine((value) => value.trim() !== "", {
      //   message: "Business Address cannot be empty or just whitespace.",
      // })
      .min(3, { message: "Business Address must be at least 3 characters" }),
    z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  ]),
  email: z.email(),
  affiliateId: z.string().refine((value) => value.trim() !== "", {
    message: "Affiliate Id cannot be empty or just whitespace.",
  }),
  taxIdNumber: z.string().refine((value) => value.trim() !== "", {
    message: "Pan Number cannot be empty or just whitespace.",
  }),
  licenseNumber: z.string().refine((value) => value.trim() !== "", {
    message: "License Number cannot be empty or just whitespace.",
  }),
  vehicleId: z.string().refine((value) => value.trim() !== "", {
    message: "Vehicle Id cannot be empty or just whitespace.",
  }),
  password: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Password cannot be empty or just whitespace.",
    })
    .min(8)
    .max(32),
  gratuity: z.string().refine((value) => value.trim() !== "", {
    message: "Gratuity cannot be empty or just whitespace.",
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
          fileObjects.every((f) => f.size <= maxSize * 1024 * 1024)
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
      {
        message: "Invalid file types detected",
      },
    ),
  status: z.string().optional(),
});

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
  data?: TChauffeur,
): TChauffeurForm | undefined => {
  if (!data) return undefined;
  console.log("edit chauffeur formdata:>", data);
  return {
    firstName: data?.userFirstName || "",
    lastName: data?.userLastName || "",
    email: data?.userEmail || "",
    password: data?.password?.replaceAll(/./g, "*") || "*************",
    businessAddress: data?.location,
    documents:
      data.documents?.map((file) => {
        // console.log("file:", file);
        return file;
      }) || [],
    status: data.status || "",
    affiliateId: data.affiliateId || "",
    taxIdNumber: data.taxIdNumber || "",
    licenseNumber: data.licenseNumber || "",
    vehicleId: data.vehicleId || "",
    gratuity: !Number.isNaN(Number(data.gratuity))
      ? Number(data.gratuity).toString()
      : "0",
  };
};

export type TChauffeurForm = z.infer<typeof formSchema>;
const ChauffeurForm: FC<IChauffeurFormProps> = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}) => {
  const { data, isFetching } = useFetchAllAffiliate({ DateRange: {} });
  const { data: fleetData, isFetching: isFleetFetching } = useFetchAllFleets({
    DateRange: {},
  });

  const [addressObj, setAddressObj] = useState<IAddressObj>();

  //   const fileRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<TChauffeurForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      businessAddress: "",
      location: {
        latitude: 0,
        longitude: 0,
      },
      documents: [],
      status: "",
    },
  });

  const handleAddressChange = useCallback(
    (value: string) => {
      console.log("lllvalue:", value);
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
  const handleFormSubmit = async (values: unknown) => {
    try {
      const formData = new FormData();

      // Append all scalar values
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("affiliateId", values.affiliateId);
      formData.append("taxIdNumber", values.taxIdNumber);
      formData.append("licenseNumber", values.licenseNumber);
      formData.append("vehicleId", values.vehicleId);
      formData.append("gratuity", values.gratuity);
      if (values.password && values.password !== "*************") {
        formData.append("password", values.password);
      }
      console.log("filetypes...:", Array.isArray(values.documents));
      console.log("values.documents:", values.documents);
      values.documents.forEach((file) => {
        if (file instanceof File) {
          formData.append(`documents`, file);
        }
      });
      formData.append("status", values.status);
      // console.log("data:>>", values);
      console.log("addressObj1:", addressObj);
      if (addressObj) {
        formData.append(
          "location",
          JSON.stringify({
            latitude: addressObj.location.latitude,
            longitude: addressObj.location.longitude,
          }),
        );
      }
      await onSubmit(formData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [_statusValue, setStatusValue] = useState<{
    status: string;
    affiliate: string;
  }>({
    status: "",
    affiliate: "",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* Chauffeur Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

                <FieldDescription>
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

                <FieldDescription>
                  Enter your family or surname as it appears officially.
                </FieldDescription>

                {form.formState.errors.lastName && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </Field>

              {isFetching ? (
                <Spinner />
              ) : data?.affiliates.length > 0 ? (
                <Field>
                  <FieldLabel
                    htmlFor="affiliateId"
                    className="text-base-black gap-0"
                  >
                    Select Affiliate
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="affiliateId"
                    render={({ field }) => (
                      <SelectDropDown
                        placeholder="Select Affiliate"
                        items={
                          data?.affiliates?.map((a) => ({
                            label: a.companyName,
                            value: a.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )}
                  />

                  <FieldDescription>Select Affiliate</FieldDescription>

                  {form.formState.errors.affiliateId && (
                    <p className="text-base-danger mt-1">
                      {form.formState.errors.affiliateId.message}
                    </p>
                  )}
                </Field>
              ) : (
                <Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>
                  <Label>Add Affiliate</Label>
                </Link>
              )}

              <Field>
                <FieldLabel htmlFor="status" className="text-base-black gap-0">
                  Select Status
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Status"
                      items={statusValues.map((s) => ({
                        label: s.label, // dynamic label
                        value: s.value, // dynamic value
                      }))}
                      value={field.value}
                      setSelectedItem={(v) => field.onChange(v)}
                    />
                  )}
                />

                <FieldDescription>Select Status</FieldDescription>

                {form.formState.errors.status && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.status.message}
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

                <FieldDescription>
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
                      <InputGroupAddon
                        align="inline-end"
                        className="cursor-pointer"
                      >
                        <IconEye />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Choose a strong password with at least 8 characters.
                </FieldDescription>

                {form.formState.errors.password && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="businessAddress"
                  className="text-base-black gap-0"
                >
                  Location
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => {
                    console.log("businessAddress", field.value);
                    return (
                      <AddressInput
                        value={field.value || ""}
                        field={field}
                        onChange={handleAddressChange}
                        onUpdate={setAddressObj}
                        disabled={isFieldDisabled(
                          disabledFields,
                          "businessAddress",
                        )}
                      />
                    );
                  }}
                />

                <FieldDescription>
                  Enter your business location.
                </FieldDescription>

                {form.formState.errors.businessAddress && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.businessAddress.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="taxIdNumber"
                  className="text-base-black gap-0"
                >
                  PAN Number
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="taxIdNumber"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="taxIdNumber"
                        type="text"
                        placeholder="ABCDE1234F"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "taxIdNumber",
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
                  Enter your 10-character PAN number.
                </FieldDescription>

                {form.formState.errors.taxIdNumber && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.taxIdNumber.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="licenseNumber"
                  className="text-base-black gap-0"
                >
                  License Number
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="licenseNumber"
                        type="text"
                        placeholder="A1234567"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "licenseNumber",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconId /> {/* You can replace with any icon */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your official license number.
                </FieldDescription>

                {form.formState.errors.licenseNumber && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.licenseNumber.message}
                  </p>
                )}
              </Field>

              <div className="col-span-full grid grid-cols-2 gap-4">
                <Field className="col-span-1">
                  <FieldLabel
                    htmlFor="vehicleId"
                    className="text-base-black gap-0"
                  >
                    Vehicle
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="vehicleId"
                    id="vehicleId"
                    render={({ field }) =>
                      isFleetFetching ? (
                        <Spinner />
                      ) : (
                        <SelectDropDown
                          placeholder="Select Vehicle"
                          items={
                            fleetData?.vehicles?.map((v) => ({
                              label: v.vehicleType,
                              value: v.id,
                            })) || []
                          }
                          value={field.value}
                          setSelectedItem={(v) => field.onChange(v)}
                        />
                      )
                    }
                  />

                  <FieldDescription>
                    Choose the vehicle assigned from fleet.
                  </FieldDescription>

                  {form.formState.errors.vehicleId && (
                    <p className="text-base-danger mt-1">
                      {form.formState.errors.vehicleId.message}
                    </p>
                  )}
                </Field>

                <Field className="col-span-1">
                  <FieldLabel
                    htmlFor="gratuity"
                    className="text-base-black gap-0"
                  >
                    Gratuity
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="gratuity"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupInput
                          id="gratuity"
                          type="number"
                          placeholder="0"
                          disabled={isFieldDisabled(disabledFields, "gratuity")}
                          {...field}
                        />
                        <InputGroupAddon>
                          <DollarSign />
                        </InputGroupAddon>
                      </InputGroup>
                    )}
                  />

                  <FieldDescription>Enter gratuity amount.</FieldDescription>

                  {form.formState.errors.gratuity && (
                    <p className="text-base-danger mt-1">
                      {form.formState.errors.gratuity.message}
                    </p>
                  )}
                </Field>
              </div>

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
                variant={"outlinePrimary"}
                type="button"
                onClick={() => {
                  form.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    businessAddress: "",
                    location: { latitude: 0, longitude: 0 },
                    affiliateId: "",
                    taxIdNumber: "",
                    licenseNumber: "",
                    vehicleId: "",
                    documents: [],
                    status: "",
                  });
                  setStatusValue({ status: "", affiliate: "" });
                  // if (fileRef.current) fileRef.current.value = "";
                  setAddressObj(undefined);
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
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default ChauffeurForm;
