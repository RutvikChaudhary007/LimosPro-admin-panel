import { zodResolver } from "@hookform/resolvers/zod";
// import { Label } from "@/components/ui/label"
import useFetchAllRegions from "@/api/region.api";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  // password: z.string().min(2, {
  //   message: "Password must be at least 2 characters.",
  // }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password no is required." })
    .trim()
    .min(7, { message: "Password must be at least 7 characters." })
    .max(25, { message: "Password can't be more than 25 characters." })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/, {
      message: "Password must include at least one special character.",
    }),
  region: z.string().min(1, "region is required"),
});

function AddRegionAdmin() {
  const { data: regionData, isFetching: regionFetching } = useFetchAllRegions({
    limit: 100,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      // phone: "",
      region: "",
      password: "",
    },
  });
  const createRegionAdmin = queries.useCreateRegionAdminMutation();
  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toastPromise(createRegionAdmin.mutateAsync(values), {
        loading: "Creating region admin...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.REGION_ADMIN);
          return "Region admin created successfully";
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Error creating region admin"),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Opps! An unexpected error occured");
      }
    }
  }
  return (
    <>
      <div className="px-10 py-6 h-[calc(100vh-146px)]">
        <Link to={constant.ROUTING_URLS.REGION_ADMIN}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
          <div className="">
            <h2 className="font-medium text-xl text-black">Region Admins</h2>
            <h4>
              <span className="text-[#959595] w-14 h-4">Region Management</span>{" "}
              <span className="text-[#959595] w-[116px] h-4">/ Admins</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Region Admin</span>
            </h4>
          </div>
        </Header>

        <div className="w-full h-[461px] bg-[#FDFDFD] shadow-base-light flex flex-col gap-[34px] p-4 overflow-auto">
          <div className="w-full text-xl font-semibold">Create Regional Admin</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-rows-4 gap-x-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 mb-[31px]">
                    <FormLabel className="text-black text-sm">First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 mb-[31px]">
                    <FormLabel className="text-black text-sm">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 mb-[31px]">
                    <FormLabel className="text-black text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 mb-[31px] ">
                    <FormLabel className="text-black text-sm">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 mb-[31px] col-span-2 col-start-1">
                    <FormLabel className="text-black text-sm">Region</FormLabel>
                    {regionFetching ? (
                      <Spinner />
                    ) : (
                      <Select onValueChange={field.onChange}>
                        <FormControl className="w-full">
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="col-span-2 col-start-1">
                          {regionData &&
                            regionData?.regions?.map((region: { id: string; regionName: string }) => (
                              <SelectItem key={region?.id} value={region?.id}>
                                {region.regionName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                variant={"outline"}
                className="text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium w-[124px] h-[39px] border-none cursor-pointer col-start1 select-none"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default AddRegionAdmin;
