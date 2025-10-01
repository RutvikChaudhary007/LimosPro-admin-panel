//@ts-nocheck
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import isFieldDisabled from "@/utils/disableFormField";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const formSchema = z.object({
    firstName: z.string().refine(value => value.trim() !== "", {
        message: "First name cannot be empty or just whitespace.",
    }).min(3, { message: "First name must be at least 3 characters" }),
    lastName: z.string().refine(value => value.trim() !== "", {
        message: "Last name cannot be empty or just whitespace.",
    }).min(3, { message: "Last name must be at least 3 characters" }),
    designation: z.string().refine(value => value.trim() !== "", {
        message: "Designation cannot be empty or just whitespace.",
    }).min(3, { message: "Designation must be at least 3 characters" }),
    password: z.string().refine(value => value.trim() !== "", {
        message: "Password cannot be empty or just whitespace.",
    }).min(3, { message: "Password must be at least 3 characters" }),
    email: z.email(),
    phone: z.string().refine(value => value.trim() !== "", {
        message: "phone cannot be empty or just whitespace.",
    }).min(8).max(32),
});

export type TCrewMemberForm = z.infer<typeof formSchema>;
const CrewMemberForm = ({ initialData, onSubmit, disabledFields, type }: { initialData?: object, onSubmit: ()=>void, disabledFields?: [], type: string}) => {
    const transformInitialData = (data?: z.infer<typeof formSchema>) => {
    
            if (!data) return undefined;
            // console.log("edit chauffeur formdata:>",data)
            return {
                firstName: data?.firstName,
                lastName: data?.lastName,
                designation: data?.designation,      
                email: data?.email,
                phone: data?.phone,
                password: data?.password,
            };
        };
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: transformInitialData(initialData) || {
                firstName: "",
                lastName: "",
                designation: "",
                email: "",
                phone: "",
                password: "",
                
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
                            name="designation"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Designation' {...field} />
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='phone' {...field} />
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
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        
                    </CardContent>
<Button disabled={form.formState.isSubmitting} type='submit' variant="secondary" className='text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer select-none mx-6'>{form.formState.isSubmitting ? "Saving..." : "Save Staff Member"}</Button>
                </Card>

            </form>
        </Form>
  )
}

export default CrewMemberForm
