//@ts-nocheck
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import isFieldDisabled from "@/utils/disableFormField";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css'; // or 'quill.bubble.css'
import { useState } from "react";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
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
    email: z.email(),
    phone: z.string().refine(value => value.trim() !== "", {
        message: "phone cannot be empty or just whitespace.",
    }).min(8).max(32),
});

export type TCrewMemberForm = z.infer<typeof formSchema>;

const ContentManagementForm = ({ initialData, onSubmit, disabledFields, type }: { initialData?: object, onSubmit: () => void, disabledFields?: [], type: string }) => {
    const [value, setValue] = useState('');
    const transformInitialData = (data?: z.infer<typeof formSchema>) => {

        if (!data) return undefined;
        // console.log("edit chauffeur formdata:>",data)
        return {
            firstName: data?.firstName,
            lastName: data?.lastName,
            designation: data?.designation,
            email: data?.email,
            phone: data?.phone,
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

        },
    });
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="rounded  overflow-auto bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>{type}</CardTitle>
                        <div className="w-[258px] flex items-center justify-between">
                            <Button type="button" onClick={() =>
                                form.clearErrors()} className="bg-[#E4E4E4] text-[#515151] hover:text-white w-[124px] h-[39px] px-2.5 py-6 font-medium">Clear All</Button>
                            <Button disabled={form.formState.isSubmitting} type='submit' variant="secondary" className='text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium  border-none cursor-pointer select-none mx-6 w-[124px] h-[39px]'>{form.formState.isSubmitting ? "Saving..." : "Save Details"}</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-5">

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px] '>
                                    <FormLabel>Page Title</FormLabel>
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
                                    <FormLabel>Meta Title</FormLabel>
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
                                <FormItem className='flex flex-col gap-3 mb-[31px] col-span-2'>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Designation' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <hr className="broder bg-black col-span-2" />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px] col-span-2'>
                                    <FormLabel>Heading</FormLabel>
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
                                <FormItem className='flex flex-col gap-3 mb-[31px] col-span-2'>
                                    <FormLabel>Sub Heading</FormLabel>
                                    <FormControl>
                                        <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='phone' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-3 mb-[31px] col-span-2'>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <ReactQuill
                                            className="col-span-2"
                                            theme="snow"
                                            value={value}
                                            onChange={setValue}
                                            modules={modules}
                                            formats={formats}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <Label className="font-medium h-[22px]"><Plus className="w-5 h-5" /> <span className="">Add Field</span></Label>
                    </CardContent>
                </Card>

            </form>
        </Form>
    )
}

export default ContentManagementForm
