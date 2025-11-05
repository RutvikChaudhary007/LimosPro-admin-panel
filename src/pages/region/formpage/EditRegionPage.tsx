import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Label } from '@/components/ui/label'
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import { toastPromise } from "@/hooks/use-toast"
import { toast } from "sonner"
import { useFetchRegionById } from "@/api/region.api"
import { Spinner } from "@/components/Spinner"
import { useEffect } from "react"

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
})
const EditRegionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isFetching } = useFetchRegionById(id!)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regionName: "",
    },
  })
  useEffect(() => {
    if (data && data?.regionName) {
      form.reset({
        regionName: data.regionName,
      })
    }
  }, [data, form])
  const editRegion = queries.useEditRegionMutation()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toastPromise(editRegion.mutateAsync({ id: id!, data: values }), {
        loading: "Updating region...",
        success: (res) => {
          if (res?.status === true) {
            navigate(constant.ROUTING_URLS.REGION)
          }
          return "Region updated successfully"
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Error updating region"),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Opps! An unexpected error occured")
      }
    } // artificial delay to notice isSubmitting
    // console.log("data:", values);
  }
  return (
    <div className="h-[calc(100vh-146px)] px-10 py-6">
      <Link to={constant.ROUTING_URLS.REGION}>
        <Button
          variant="outline"
          className="flex h-[31px] w-[80px] cursor-pointer items-center justify-center rounded bg-[#D9D9D9] px-1.5 py-3 text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="mt-4 mb-5 h-[79px] rounded-[6px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="">
          <h2 className="text-xl font-medium text-black">Region Management</h2>
          <h4>
            <span className="h-4 w-14 text-[#959595]">LIMOSPRO</span>{" "}
            <span className="h-4 w-[116px] text-[#959595]">/ Region Management</span>{" "}
            <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Edit Regions</span>
          </h4>
        </div>
      </Header>

      {isFetching ? (
        <Spinner />
      ) : (
        <div className="flex h-[316px] w-full flex-col gap-[34px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] shadow-[#F1F1F1] hover:outline-none">
          <div className="w-full text-xl font-semibold">Edit Regions</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="regionName"
                render={({ field }) => (
                  <FormItem className="mb-[31px] flex flex-col gap-3">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded bg-[#FFFFFF] shadow shadow-[#D9D9D9] placeholder:text-[#E6E6E6]"
                        placeholder="Region name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                variant={"outline"}
                className="h-[39px] w-[124px] cursor-pointer rounded border-none bg-[#E4E4E4] px-2.5 py-6 text-center text-sm font-medium text-[#515151] select-none"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Region"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}

export default EditRegionPage
