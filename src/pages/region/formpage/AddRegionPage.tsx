import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Label } from '@/components/ui/label'
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import { toast } from "sonner"
import { toastPromise } from "@/hooks/use-toast"

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
})
export type TRegion = z.infer<typeof formSchema>
function AddRegionPage() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regionName: "",
    },
  })
  const createRegion = queries.useCreateRegionMutation()
  async function onSubmit(values: TRegion) {
    try {
      toastPromise(createRegion.mutateAsync(values), {
        loading: "Creating region...",
        success: (res) => {
          if (res?.status === true) {
            navigate(constant.ROUTING_URLS.REGION)
          }
          return "Yeah! Region created successfully"
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Failed to create region"),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }
  return (
    <div className="h-[calc(100vh-146px)] px-10 py-6">
      <Link to={constant.ROUTING_URLS.REGION}>
        <Button variant={"outlinePrimary"}>
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="mt-4 mb-5 h-[79px] rounded-[6px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="">
          <h2 className="text-xl font-medium text-black">Region Management</h2>
          <h4>
            <span className="h-4 w-14 text-[#959595]">LIMOSPRO</span>{" "}
            <span className="h-4 w-[116px] text-[#959595]">/ Region Management</span>{" "}
            <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Add Regions</span>
          </h4>
        </div>
      </Header>

      <div className="flex h-[316px] w-full flex-col gap-[34px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] shadow-[#F1F1F1] hover:outline-none">
        <div className="w-full text-xl font-semibold">Create Regions</div>
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
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Saving..." : "Save Region"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddRegionPage
