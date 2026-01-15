// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import type { IUserFormData, TUserFormProps } from "@/types/user.type";
import { Button } from "../ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// import { useEffect, useState } from 'react';

const formSchema = z.object({
  // firstName: z.string().refine(value => value.trim() !== "", {
  //     message: "First name cannot be empty or just whitespace.",
  // }).min(3, { message: "First name must be at least 3 characters" }),
  // lastName: z.string().refine(value => value.trim() !== "", {
  //     message: "Last name cannot be empty or just whitespace.",
  // }).min(3, { message: "Last name must be at least 3 characters" }),
  // dateOfBirth: z.date({
  //     message: "A date of birth is required.",
  // }),
  // address: z.string().refine(value => value.trim() !== "", {
  //     message: "Address cannot be empty or just whitespace.",
  // }).min(3, { message: "Address must be at least 3 characters" }),
  // email: z.email(),
  // password: z.string().optional(),
  // phone: z
  //     .string()
  //     .min(1, { message: "Phone is required" })
  //     .regex(/^\d+$/, { message: "Must be number" })
  //     .transform((v) => Number(v))
  //     .refine((n) => n >= 0, { message: "Must be non‑negative" }),
  status: z.string(),
  // gender: z.enum(["male", "female", "other"]),
});

const statusAction = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "In Active", value: "inactive" },
];

type TUserForm = z.infer<typeof formSchema>;
const UserForm = ({
  initialData,
  onSubmit,
  disabledFields: _disabledFields,
  type,
}: TUserFormProps) => {
  const transformInitialData = (
    data?: IUserFormData,
  ): TUserForm | undefined => {
    if (!data) return undefined;
    return {
      // firstName: data.firstName,
      // lastName: data.lastName,
      // email: data.email,
      // password: data.password,
      // address: data.address,
      // dateOfBirth: data.dateOfBirth,
      // gender: data.gender,
      // phone: parseInt(data.phone),
      status: data.status,
    };
  };
  const form = useForm<IUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      // firstName: "",
      // lastName: "",
      // email: "",
      // address: "",
      // dateOfBirth: "",
      // password: "",
      status: "active",
      // gender: "",
      // phone: "",
    },
  });
  const handleFormSubmit = async (data: IUserFormData) => {
    console.log("data::", data);
    await onSubmit(data);
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
              {/* <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem className="col-span-3 ">
                                    <FormLabel className='text-sm h-3.5'>First Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                        <Input
                                            className=""
                                            placeholder="First name"
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
                            name='lastName'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-3 ">
                                    <FormLabel className='h-3.5'>Last Name</FormLabel>
                                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                        <Input
                                            className=""
                                            placeholder="Last name"
                                            disabled={isFieldDisabled(disabledFields, "lastName")}
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
                            name='gender'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className=" ">
                                    <FormLabel className='h-3.5'>Gender</FormLabel>
                                    <Select value={field.value} onValueChange={(v) => {
                                        field.onChange(v);
                                    }} defaultValue={field.value}>
                                        <FormControl className="w-full min-w-full rounded">
                                            <SelectTrigger className="cursor-pointer">
                                                <SelectValue className="" placeholder="select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="">
                                            <SelectItem className="cursor-pointer" key={"male"} value={"male"}>Male</SelectItem>
                                            <SelectItem className="cursor-pointer" key={"female"} value={"female"}>Female</SelectItem>
                                            <SelectItem className="cursor-pointer" key={"other"} value={"other"}>Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.gender ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.gender?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='dateOfBirth'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className=" ">
                                    <FormLabel className='text-sm h-3.5'>Date Of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl className='px-2 py-4 rounded'>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[145px] px-3 py-4 text-left placeholder:text-[#E6E6E6] font-medium",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd-MM-yyyy")
                                                    ) : (
                                                        <span className='placeholder:text-[#E6E6E6] font-medium'>dd-mm-yyyy</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.dateOfBirth ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.dateOfBirth?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 col-start-3">
                                    <FormLabel className='text-sm h-3.5'>Email</FormLabel>
                                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                        <Input
                                            className=""
                                            placeholder="Email"
                                            disabled={isFieldDisabled(disabledFields, "email")}
                                            {...field}
                                        />
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
                            name='phone'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 col-start-5 mr-5 mb-5">
                                    <FormLabel className='text-sm h-3.5'>Phone</FormLabel>
                                    <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                        <Input
                                            className=""
                                            placeholder="+1-234-567-890"
                                            disabled={isFieldDisabled(disabledFields, "phone")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        className={`mt-1 h-5 ${form.formState.errors.phone ? 'visible text-red-600' : 'invisible'
                                            }`}
                                    >
                                        {form.formState.errors.phone?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        /> */}
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm h-3.5">Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        // setStatusValue({ ...statusValue, Partner: v })
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full min-w-full rounded">
                        <SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
                          <SelectValue
                            className="before:placeholder:text-[#E6E6E6] font-medium"
                            placeholder="select Partner"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        {statusAction?.map((option) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={option.label}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage
                      className={`mt-1 h-5 ${form.formState.errors.status ? "visible text-red-600" : "invisible"}`}
                    >
                      {form.formState.errors.status?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="px-3 py-4 rounded col-span-2 col-start-5 placeholder:text-[#E6E6E6] font-medium">
                                <FormLabel>Location</FormLabel>
                                    <FormControl>
                                    <AddressInput
                                        value={newAddress}
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
                        /> */}
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                variant={"outlinePrimary"}
                type="button"
                onClick={() => {
                  form.reset({
                    // firstName: "",
                    // lastName: "",
                    // email: "",
                    // phone: "",
                    // gender: null,
                    // dateOfBirth: null,
                    // password: "",
                    status: "",
                  });
                  // setGender("");
                  // setStatusValue({ status: "", Partner: "" });
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

export default UserForm;
