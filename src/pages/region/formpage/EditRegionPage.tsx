import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from '@/components/ui/label'
import { useFetchRegionById } from "@/api/region.api";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
});
const EditRegionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchRegionById(id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regionName: "",
    },
  });
  useEffect(() => {
    if (data && data?.regionName) {
      form.reset({
        regionName: data.regionName,
      });
    }
  }, [data, form]);
  const editRegion = queries.useEditRegionMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toastPromise(editRegion.mutateAsync({ id: id!, data: values }), {
        loading: "Updating region...",
        success: (res) => {
          if (res?.status === true) {
            navigate(constant.ROUTING_URLS.REGION);
          }
          return "Region updated successfully";
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Error updating region"),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unexpected error occured");
      }
    } // artificial delay to notice isSubmitting
    // console.log("data:", values);
  }
  return (
    <>
      <div className="px-10 py-6 h-[calc(100vh-146px)]">
        <Link to={constant.ROUTING_URLS.REGION}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
          <div className="">
            <h2 className="font-medium text-xl text-black">Region Management</h2>
            <h4>
              <span className="text-[#959595] w-14 h-4">LIMOSPRO</span>{" "}
              <span className="text-[#959595] w-[116px] h-4">/ Region Management</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Regions</span>
            </h4>
          </div>
        </Header>

        {isFetching ? (
          <Spinner />
        ) : (
          <div className="w-full h-[316px] bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-base-light flex flex-col gap-[34px] p-4">
            <div className="w-full text-xl font-semibold">Edit Regions</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="regionName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 mb-[31px]">
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
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
                  className="text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer select-none"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Region"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditRegionPage;
