// @ts-nocheck
import { useRef, useState, type FC, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import isFieldDisabled from "@/utils/disableFormField"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import AddressInput from "../AddressInput"
import { Switch } from "../ui/switch"
import type { IAffiliate } from "@/types/affiliate"

const maxSize = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const formSchema = z.object({
    firstName: z.string().refine(value => value.trim() !== "", {
        message: "First name cannot be empty or just whitespace.",
    }).min(3, { message: "First name must be at least 3 characters" }),
    lastName: z.string().refine(value => value.trim() !== "", {
        message: "Last name cannot be empty or just whitespace.",
    }).min(3, { message: "Last name must be at least 3 characters" }),
    businessLocation: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
    businessAddress: z.string().refine(value => value.trim() !== "", {
        message: "Business Address cannot be empty or just whitespace.",
    }).min(3, { message: "Business Address must be at least 3 characters" }),
    companyName: z.string().min(3, { message: "Company name must be at least 3 characters" }),
    email: z.email(),
    businessContactNumber: z
        .string()
        .min(1, { message: "Phone is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        // .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    entityType: z.string().min(1, { message: "Entity Type is required" }),
    isChauffer: z.boolean(),
    taxId: z.string().min(2, { message: "Tax id is required." }),
    businessEmail: z.email(),
    commissionRate: z
        .string()
        .min(1, { message: "Commission Rate is required" })
        .regex(/^\d+$/, { message: "Must be number" })
        .transform((v) => Number(v))
        .refine((n) => n >= 0, { message: "Must be non‑negative" }),
    password: z.string().refine(value => value.trim() !== "", {
        message: "Password cannot be empty or just whitespace.",
    }),
    documents: z
    .array(z.instanceof(File))
    .min(1, { message: "Select at least 1 file" })
    .max(4, { message: "You can upload up to 4 files" })
    .refine(files => files.every(f => f.size <= maxSize), {
      message: `Max size ${maxSize / (1024 * 1024)}MB`,
    })
    .refine(files => files.every(f => ALLOWED_MIME_TYPES.includes(f.type)), {
      message: "Invalid file types detected",
    }),
    //   password: z.string().min(10, { message: "Password must be at least 10 characters" }),
    status: z.string().optional(),
    // status: z.union([z.string(), z.literal("")]).optional(),
});

type TAffiliateForm = z.infer<typeof formSchema>;
interface AffiliateFormProps {
    initialData?: TAffiliateForm;
    onSubmit: (data: IAffiliate) => Promise<unknown>;
    disabledFields?: string[];
    type: string;
}

const showStatus = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const showEntity = [
    { label: "Active", value: "active" },
]

interface IAddressObj {
    zip: string;
    city: string;
    address: string;
    state: string;
    country: string;
    location: {
        latitude:number | null;
        longitude:number | null;
    }
}

const AffiliateForm: FC<AffiliateFormProps> = ({ initialData, onSubmit, disabledFields, type }) => {
        const [newAddress, setNewAddress] = useState("");
        const [addressObj, setAddressObj] = useState<IAddressObj>();
        const [isAddressValid, setIsAddressValid] = useState(false);
        const fileRef = useRef<HTMLInputElement | null>(null);

        const [statusValue, setStatusValue] = useState<{status:string, entityType:string}>({
            status: "",
            entityType: ""
        });
    const transformInitialData = (data?: TAffiliateForm): TAffiliateForm | undefined => {
        if (!data) return undefined;
        // console.log("initial data:", data)
        
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            isChauffer: data.isChauffer,
            companyName: data.companyName,
            businessContactNumber: data.businessContactNumber,
            businessAddress: data.businessAddress,
            businessEmail: data.businessEmail,
            businessLocation: data.businessLocation,
            entityType: data.entityType,
            taxId: data.taxId,
            commissionRate: !isNaN(data?.commissionRate) ? parseInt(data.commissionRate):0,
            documents: data.documents,
            status: data.status,
        };
    };
    const form = useForm<TAffiliateForm>({
        resolver: zodResolver(formSchema),
        defaultValues: transformInitialData(initialData) || {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            isChauffer: false,
            companyName: "",
            businessContactNumber: 0,
            businessAddress: "",
            businessEmail: "",
            businessLocation: {
                latitude: 0,
                longitude: 0,
            },
            entityType: "",
            taxId: "",
            commissionRate: 0,
            documents: [],
            status: "",
            
        }
    });
    useEffect(()=>{
        if(initialData?.businessAddress){
            setNewAddress(initialData.businessAddress);
        }
    },[initialData])
    const documents = form.watch("documents");
    const fileCount = documents?.length || 0;
    const handleFormSubmit = async (values: IAffiliate) => {
        try {
            if (values) {
                values.businessLocation = {
                latitude: addressObj?.location.latitude,
                longitude: addressObj?.location.longitude,
                } 
            }
            console.log("values:",values)
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
            formData.append("commissionRate", values.commissionRate.toString());
            formData.append("status", values.status);
            formData.append("isChauffer", values.isChauffer ? "true" : "false");
            formData.append("taxId", values.taxId);
            formData.append("businessLocation", JSON.stringify(values.businessLocation));
          
            // Append files
            values.documents.forEach((file) => {
              formData.append(`documents`, file); 
            });
            
            await onSubmit(formData);
            form.reset()
        } catch (error) {
            console.error(error)
        }
    }
    
    return (

        <Form  {...form}>
            <form method="POST" onSubmit={
                form.handleSubmit(handleFormSubmit)
            } className="space-y-6 pb-[68px]">
                
                {/* Affiliate Details */}
                <Card className="overflow-y-auto rounded">
                    <CardHeader>
                        <CardTitle>{type}</CardTitle>
                    </CardHeader>
                    <CardContent className=" grid grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem className="col-span-2 col-start-1 ">
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input
                                            className=""
                                            placeholder="company name"
                                            disabled={isFieldDisabled(disabledFields, "companyName")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.companyName ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.companyName?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input
                                            placeholder="e.g., Jhon"
                                            disabled={isFieldDisabled(disabledFields, "firstName")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.firstName ? 'visible text-red-600' : 'invisible'
                                            }`}
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
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input
                                            placeholder="e.g., Doe"
                                            disabled={isFieldDisabled(disabledFields, "lastName")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.lastName ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.lastName?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="col-span-2 col-start-2">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input
                                            placeholder="e.g., mysecretpasswd123"
                                            disabled={isFieldDisabled(disabledFields, "password")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.password ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.password?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="Email"
                                            disabled={isFieldDisabled(disabledFields, "email")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.email ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.email?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="businessContactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="+1-234-567-890"
                                            disabled={isFieldDisabled(disabledFields, "email")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.businessContactNumber ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.businessContactNumber?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="businessAddress"
                            render={({ field }) => (
                                <FormItem className="px-3 py-4 rounded">
                                    <FormLabel>Company Location</FormLabel>
                                    <FormControl>
                                        {/* <Input
                                            className="rounded"
                                            placeholder="Enter address"
                                            disabled={isFieldDisabled(disabledFields, "businessAddress")}
                                            {...field}
                                        /> */}
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
                                        className={`inline-block h-7 text-left align-middle mt-1 invisible ${form.formState.errors.businessAddress ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.businessAddress?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="entityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entity Type</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="Corporation"
                                            disabled={isFieldDisabled(disabledFields, "entityType")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.taxId ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.entityType?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taxId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Id</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="900-70-0000"
                                            disabled={isFieldDisabled(disabledFields, "taxId")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.taxId ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.taxId?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="commissionRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Commission Rate</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="12"
                                            disabled={isFieldDisabled(disabledFields, "commissionRate")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.commissionRate ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.commissionRate?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
  control={form.control}
  name="documents"
  render={({ field }) => (
    <FormItem className="col-span-2 col-start-1 rounded ">
      <FormLabel>
        Upload Documents: {["Document 1*", "Document 2*", "Document 3*", "Document 4*"].map((text, idx) => (
          <span
            key={idx}
            className={idx < fileCount ? "text-gray-700 underline" : "text-gray-300"}
          >
            {text}{" "}
          </span>
        ))}
      </FormLabel>
      <FormControl>
        <Input
          type="file"
          ref={fileRef}
          multiple
          accept="image/jpeg,image/png,application/pdf"
          value={undefined}
          onChange={e => {
            const files = e.target.files;
            if (files) field.onChange(Array.from(files)); // File[]
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                        {/* <FormField
                            control={form.control}
                            name="documents"
                            defaultValue={[]}
                            render={({ field }) => (
                                <FormItem className="col-span-2 col-start-1 rounded ">
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
                                            className="rounded cursor-pointer"
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
                        <Controller
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Status</FormLabel>
                                    <Select value={field.value} onValueChange={(v) => { 
                                        field.onChange(v);
                                        // setStatusValue((prev) => ({ ...prev, status: v }));
                                        }} >
                                        <FormControl className="w-full min-w-full rounded">
                                            <SelectTrigger className="cursor-pointer">
                                                <SelectValue className="" placeholder="select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="">
                                            {/* <SelectGroup > */}
                                            {showStatus.map(option => (
                                                <SelectItem  className="cursor-pointer" key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                            {/* </SelectGroup> */}
                                        </SelectContent>

                                    </Select>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.status ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >{form.formState.errors.status?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
              control={form.control}
              name="isChauffer"
              render={({ field }) => (
                <FormItem className="rounded">
                    <FormLabel>Chauffeur</FormLabel>
                  <FormControl>
                    <Switch
                    className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
                            control={form.control}
                            name="businessEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Email</FormLabel>
                                    <FormControl className="px-3 py-4 rounded">
                                        <Input placeholder="business email"
                                            disabled={isFieldDisabled(disabledFields, "businessEmail")} {...field} />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.businessEmail ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.businessEmail?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <div className="flex items-center justify-start rounded px-6 space-x-2.5">
                        <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="button" onClick={() => {
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
        // documents: [],
        status: ""
    });
    setStatusValue({ status: "", entityType: "" });
    if (fileRef.current) fileRef.current.value = "";
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

export default AffiliateForm
