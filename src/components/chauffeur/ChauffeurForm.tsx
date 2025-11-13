//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useFetchAllAffiliate from "@/api/getAllAffiliate.api";
import useFetchAllFleets from "@/api/getAllFleets.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// const affiliate = [
//     {
//         id: "ac28bba6-7823-4a84-8f57-89d1a7d160e0",
//         affiliateName: "Zenith Holdings",
//         userId: "1694b4a2-c5dd-4e1c-9fa4-ebe70687b18f",
//         isChauffer: true,
//         companyName: "bhoraniya enterpricebb",
//         taxId: "tax-husainsdfd",
//         entityType: "safe",
//         businessEmail: "akbar.bhoraniyddfa2@qalbit.com",
//         businessContactNumber: "1234567890",
//         businessAddress: "272 Water Street, New York, NY 10038, United States of America",
//         businessLocation: {
//             latitude: 18.530802513337985,
//             longitude: 73.85830250715696
//         },
//         commissionRate: "23.00",
//         documents: [
//             {
//                 size: 120009,
//                 status: "pending",
//                 fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/affiliates/1754564045264-resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
//                 mimetype: "application/pdf",
//                 originalName: "resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf"
//             },
//             {
//                 size: 157039,
//                 status: "pending",
//                 fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/affiliates/1754564045264-Screenshot%20%288%29.png",
//                 mimetype: "image/png",
//                 "originalName": "Screenshot (8).png"
//             },
//             {
//                 size: 254971,
//                 status: "pending",
//                 fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/affiliates/1754564045269-Screenshot%20%287%29.png",
//                 mimetype: "image/png",
//                 "originalName": "Screenshot (7).png"
//             }
//         ],
//         stripeAccountId: "acct_1RtRSU3C8pRaWHyZ",
//         stripeAccountStatus: "inPogress",
//         status: "Active",
//         createdAt: "2025-08-07T10:54:10.651Z",
//         updatedAt: "2025-08-07T10:54:10.651Z",
//         chauffeurs: []
//     }
// ]
const statusValues = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];
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
  // location: z.object({
  //     latitude: z.number(),
  //     longitude: z.number(),
  // }),
  businessAddress: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Business Address cannot be empty or just whitespace.",
    })
    .min(3, { message: "Business Address must be at least 3 characters" }),
  email: z.email(),
  affiliateId: z.string().refine((value) => value.trim() !== "", {
    message: "Affiliate Id cannot be empty or just whitespace.",
  }),
  panNumber: z.string().refine((value) => value.trim() !== "", {
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
    businessAddress: data.businessAddress || "",
    location: data.Address || { latitude: 0, longitude: 0 },
    documents:
      data.documents?.map((file) => {
        console.log("file:", file);
        return file;
      }) || [],
    status: data.status || "",
    affiliateId: data.affiliateId || "",
    panNumber: data.panNumber || "",
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
  const [_newAddress, setNewAddress] = useState(
    "11 Greenwich Street, New York, NY, 10124, US",
  );
  const [addressObj, setAddressObj] = useState<IAddressObj>();
  const [_isAddressValid, setIsAddressValid] = useState(false);

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
  useEffect(() => {
    if (initialData) {
      form.reset(transformInitialData(initialData));
      setNewAddress(initialData.businessAddress || "");
    }
  }, [initialData, form]);
  // const documents = form.watch("documents");
  // const fileCount = documents?.length || 0;

  const handleFormSubmit = async (values: unknown) => {
    try {
      const formData = new FormData();

      // Append all scalar values
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      // formData.append("businessAddress", values.businessAddress);
      formData.append("email", values.email);
      formData.append("affiliateId", values.affiliateId);
      formData.append("panNumber", values.panNumber);
      formData.append("licenseNumber", values.licenseNumber);
      formData.append("vehicleId", values.vehicleId);
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
            <CardContent className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-3 col-start-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                      <Input
                        placeholder="e.g., Jhon"
                        disabled={isFieldDisabled(disabledFields, "firstName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.firstName ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.firstName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl className="px-3 py-4 rounded col-span-3 col-start-4 placeholder:text-[#E6E6E6] font-medium">
                      <Input
                        placeholder="e.g., Doe"
                        disabled={isFieldDisabled(disabledFields, "lastName")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.lastName ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.lastName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {isFetching ? (
                <Spinner />
              ) : data?.affiliates.length > 0 ? (
                <FormField
                  control={form.control}
                  name="affiliateId"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-4 col-start-1">
                      <FormLabel className="placeholder-[#E6E6E6] font-medium">
                        Select Affiliate
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          // setStatusValue({ ...statusValue, affiliate: v })
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full min-w-full rounded">
                          <SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
                            <SelectValue
                              className="before:placeholder:text-[#E6E6E6] font-medium"
                              placeholder="select affiliate"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="">
                          {data?.affiliates?.map((option) => (
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
              ) : (
                <Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>
                  <Label>Add Affiliate</Label>
                </Link>
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full col-span-2 col-start-5">
                    <FormLabel>Select Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        // setStatusValue({ ...statusValue, status: v })
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full min-w-full rounded">
                        <SelectTrigger className="cursor-pointer w-full">
                          <SelectValue
                            className=""
                            placeholder="select status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        {statusValues.map((option) => (
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
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.status ? "visible text-red-600" : "invisible"} `}
                    >
                      {form.formState.errors.status?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2 col-start-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl className="">
                      <Input
                        className="rounded placeholder:text-[#E6E6E6] font-medium"
                        placeholder="name@email.com"
                        disabled={isFieldDisabled(disabledFields, "email")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.email ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2 col-start-3 ">
                    <FormLabel>Password</FormLabel>
                    <FormControl className="">
                      <Input
                        type="password"
                        className="rounded placeholder:text-[#E6E6E6] font-medium"
                        placeholder="name@email.com"
                        disabled={isFieldDisabled(disabledFields, "password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.password ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem className="px-3 py-4 rounded col-span-2 col-start-5 placeholder:text-[#E6E6E6] font-medium">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
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
                      />
                    </FormControl>
                    <FormMessage
                      className={`inline-block h-7 text-left align-middle mt-1 invisible ${
                        form.formState.errors.businessAddress
                          ? "visible text-red-600"
                          : "invisible"
                      }`}
                    >
                      {form.formState.errors.businessAddress?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl className="">
                      <Input
                        className="rounded placeholder:text-[#E6E6E6] font-medium"
                        placeholder="ABCDE1234F"
                        disabled={isFieldDisabled(disabledFields, "panNumber")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.panNumber ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.panNumber?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2 ">
                    <FormLabel>License Number</FormLabel>
                    <FormControl className="">
                      <Input
                        className="rounded placeholder:text-[#E6E6E6] font-medium"
                        placeholder="A1234567"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "licenseNumber",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.licenseNumber ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.licenseNumber?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Vehicle ID</FormLabel>
                    {isFleetFetching ? (
                      <Spinner />
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
                          <SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
                            <SelectValue
                              className="before:placeholder:text-[#E6E6E6] font-medium"
                              placeholder="select affiliate"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="">
                          {fleetData?.vehicles?.map((option) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={option.id}
                              value={option.id}
                            >
                              {option.vehicleType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.vehicleId ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.vehicleId?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gratuity"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Gratuity</FormLabel>
                    <FormControl className="">
                      <Input
                        className="rounded placeholder:text-[#E6E6E6] font-medium"
                        placeholder="0"
                        disabled={isFieldDisabled(disabledFields, "gratuity")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.gratuity ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.gratuity?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* <FormField
                            control={form.control}
                            name="documents"
                            defaultValue={data?.documents || []}
                            render={({ field }) => (
                                <FormItem className="col-span-6 rounded ">
                                    <FormLabel>Upload Documents: {["Document 1*", "Document 2*", "Document 3*", "Document 4*"].map((text, idx) => (
                                        <span
                                            key={idx}
                                            className={idx < fileCount ? "text-gray-700 underline" : "text-gray-300"}
                                        >
                                            {text}{" "}
                                        </span>
                                    ))}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="rounded cursor-pointer placeholder-[#E6E6E6]"
                                            type="file"
                                            ref={fileRef}
                                            multiple
                                            accept="image/jpeg,image/png,application/pdf"
                                            value={undefined}
                                            onChange={e => {
                                                const files = e.target.files;
                                                if (files) field.onChange(Array.from(files));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem className="col-span-6 rounded">
                    <FormLabel>
                      Upload Documents:{" "}
                      {[
                        "Document 1*",
                        "Document 2*",
                        "Document 3*",
                        "Document 4*",
                      ].map((text, idx) => (
                        <span
                          key={idx - text}
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

                    {/* File Input */}
                    <FormControl>
                      <Input
                        className="rounded cursor-pointer placeholder-[#E6E6E6]"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,application/pdf"
                        value={undefined} // prevents React controlled input warning
                        onChange={(e) => {
                          const newFiles = Array.from(e.target.files ?? []);
                          // Filter out File objects from current value (keep only document objects with url)
                          const existingDocs = field.value.filter(
                            (doc?: File | string) =>
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
                    panNumber: "",
                    licenseNumber: "",
                    vehicleId: "",
                    documents: [],
                    status: "",
                  });
                  setStatusValue({ status: "", affiliate: "" });
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
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default ChauffeurForm;
