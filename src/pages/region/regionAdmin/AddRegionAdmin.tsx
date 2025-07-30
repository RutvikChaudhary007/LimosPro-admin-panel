import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email:  z.string({ message: "Email is required." }).email({ message: "Please enter a valid email address" }),
  phone: z
  .string({ message: "Phone no is required." })
  .min(7, { message: "Phone number must be at least 7 digits." })
  .max(15, { message: "Phone number can't be more than 15 digits." })
  .regex(/^[0-9]+$/, { message: "Phone number must only contain digits." }),
  permission: z.string().min(1, "Permission is required")
});

function AddRegionAdmin() {
  const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            permission: "",
          },   
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
      await new Promise(res => setTimeout(res, 1200)); // artificial delay to notice isSubmitting
  console.log("data:", values);
    }
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)]'>
            <Link to="/region_management/region/admins">
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className='p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5'>
            <div className=''>
                <h2 className="font-medium text-xl text-black">Region Admins</h2>
                <h4><span className="text-[#959595] w-14 h-4">Region Management</span> <span className="text-[#959595] w-[116px] h-4">/ Admins</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Region Admin</span></h4>
            </div>
      </Header>

      <div className='w-full h-[461px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[34px] p-4 overflow-auto'>
        <div className='w-full text-xl font-semibold'>
            Create Regional Admin
        </div>
        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-rows-4 gap-x-5">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                        <FormLabel className='text-black text-sm'>First Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='First Name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                        <FormLabel className='text-black text-sm'>Last Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Last Name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                        <FormLabel className='text-black text-sm'>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Email' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({field}) => (
                                    <FormItem className='flex flex-col gap-3 mb-[31px]'>
                                        <FormLabel className='text-black text-sm'>Phone</FormLabel>
                                        <FormControl>
                                            <Input type='tel' className='
                                            bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Phone' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="permission"
                                render={({field}) => (
                                    <FormItem className='flex flex-col gap-3 mb-[31px] col-span-2 col-start-1'>
                                        <FormLabel className='text-black text-sm'>Permission</FormLabel>
                                        <Select 
                                        
                                        onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="min-w-full">
                    <SelectValue placeholder="Select a verified email to display"  />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="col-span-2 col-start-1">
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <Button disabled={form.formState.isSubmitting} type='submit' variant={"outline"} className='text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer col-start1 select-none'>{form.formState.isSubmitting ? "Saving...":"Save Details"}</Button>
                        </form>
                    </Form>
      </div>
        </div>
    </AdminRootLayout>
  )
}

export default AddRegionAdmin
