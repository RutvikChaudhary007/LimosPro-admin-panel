import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
})
function AddRegionPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    defaultValues: {
      regionName: "",
    },
  
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise(res => setTimeout(res, 1200)); // artificial delay to notice isSubmitting
  console.log("data:", values);
  }
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)]'>
            <Link to="/region_management/regions">
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className='p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5'>
            <div className=''>
                <h2 className="font-medium text-xl text-black">Region Management</h2>
                <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ Region Management</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Add Regions</span></h4>
            </div>
      </Header>

      <div className='w-full h-[316px] bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-[34px] p-4'>
        <div className='w-full text-xl font-semibold'>
            Create Regions
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
          control={form.control}
          name="regionName"
          render={({ field }) => (
        <FormItem className='flex flex-col gap-3 mb-[31px]'>
            <FormControl>
            <Input type='text' className='bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]' placeholder='Region name' {...field}/>
            </FormControl>
            <FormMessage />
        </FormItem>
        )}/>
        <Button  disabled={form.formState.isSubmitting} type='submit' variant={"outline"} className='text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer select-none'>{form.formState.isSubmitting ? "Saving...":"Save Region"}</Button>
            </form>
        </Form>
      </div>
        </div>
    </AdminRootLayout>
  )
}

export default AddRegionPage
