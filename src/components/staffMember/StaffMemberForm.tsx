// @ts-nocheck
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import z from "zod";
import { Button } from "../ui/button";
import type { TStaffMemberForm } from "@/types/staffMember.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useFetchAllRegions from "@/api/getAllRegion.api";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "Frist Name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last Name must be at least 2 characters.",
    }),
    email: z.email({
        message: "Email is required"
    }),
    password: z.string(),
//     password: z.string()
//   .min(8, { message: "Minimum length of 8" })
//   .refine((pw) => /[A-Z]/.test(pw), { message: "Needs uppercase" })
//   .refine((pw) => /[a-z]/.test(pw), { message: "Needs lowercase" })
//   .refine((pw) => /\d/.test(pw), { message: "Needs a number" })
//   .refine((pw) => /[!@#$%^&*]/.test(pw), { message: "Needs a special character" }),
    role: z.string(),
    region: z.string(),
});

const StaffMemberForm = ({ initialData, onSubmit, disabledFields, type }: TStaffMemberForm) => {
    //TODO: need to change it to permission id
const {data,isFetching} = useFetchAllRegions({DateRange:{}});
    const transformInitialData = (data?: z.infer<typeof formSchema>) => {

        if (!data) return undefined;
        // console.log("edit chauffeur formdata:>",data)
        return {
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            password: data?.password.replace(/./g, '*') ?? "***********",
            role: data?.role ?? "",
            region: data?.region ?? "",
        };
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: transformInitialData(initialData) || {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
            region: "",
        },
    });

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="rounded  overflow-auto bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                    <CardHeader>
                        <CardTitle>{type}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px] '>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Frist Name' disabled={isFieldDisabled(disabledFields, "firstName")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px]  '>
                                    <FormControl >
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Last Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-full">
                                    <FormLabel className="placeholder-[#E6E6E6] font-medium">Select Role</FormLabel>
                                    {isFetching? <p>Loading...</p> : (
                                        <Select value={field.value}  onValueChange={(v) => {
                                        field.onChange(v);
                                       
                                    }} defaultValue={field.value[0]}>
                                        <FormControl className="w-full min-w-full rounded">
                                            <SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
                                                <SelectValue className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="">
                                            {data?.regions?.map((option) => (
                                                <SelectItem className="cursor-pointer" key={option?.id} value={option?.id}>{option?.regionName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    )}
                                    
                                    <FormMessage
                                        className={`mt-1 h-5 
                                            ${form.formState.errors.role ? 'visible text-red-600' : 'invisible'
                                            } `}
                                    >
                                        {form.formState.errors.role?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-full">
                                    <FormLabel className="placeholder-[#E6E6E6] font-medium">Select Region</FormLabel>
                                    {isFetching? <p>Loading...</p> : (
                                        <Select value={field.value}  onValueChange={(v) => {
                                        field.onChange(v);
                                       
                                    }} defaultValue={field.value[0]}>
                                        <FormControl className="w-full min-w-full rounded">
                                            <SelectTrigger className="cursor-pointer w-full placeholder-[#E6E6E6] font-medium">
                                                <SelectValue className="before:placeholder:text-[#E6E6E6] font-medium" placeholder="select region" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="">
                                            {data?.regions?.map((option) => (
                                                <SelectItem className="cursor-pointer" key={option?.id} value={option?.id}>{option?.regionName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    )}
                                    
                                    <FormMessage
                                        className={`mt-1 h-5 
                                            ${form.formState.errors.region ? 'visible text-red-600' : 'invisible'
                                            } `}
                                    >
                                        {form.formState.errors.region?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <Button disabled={form.formState.isSubmitting} type='submit' variant="secondary" className='text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer select-none'>{form.formState.isSubmitting ? "Saving..." : "Save Staff Member"}</Button>
                    </CardContent>

                </Card>

            </form>
        </Form>
    )
}

export default StaffMemberForm
