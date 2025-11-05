import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { constant } from "@/lib/constant"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password no is required." })
    .trim()
    .min(7, { message: "Password must be at least 7 characters." })
    .max(25, { message: "Password can't be more than 25 characters." })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/, {
      message: "Password must include at least one special character.",
    }),
  permission: z.string().min(1, "Permission is required"),
})

const mockData = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@email.com",
  phone: "+19744561144",
  permission: "Admin",
}
const EditRegionAdmin = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mockData || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      permission: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise((res) => setTimeout(res, 1200)) // artificial delay to notice isSubmitting
    console.log("data:", values)
  }
  return (
    <div className="h-[calc(100vh-146px)] px-10 py-6">
      <Link to={constant.ROUTING_URLS.REGION_ADMIN}>
        <Button variant="outlinePrimary">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="mt-4 mb-5 h-[79px] rounded-[6px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="">
          <h2 className="text-xl font-medium text-black">Region Admins</h2>
          <h4>
            <span className="h-4 w-14 text-[#959595]">Region Management</span>{" "}
            <span className="h-4 w-[116px] text-[#959595]">/ Admins</span>{" "}
            <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Edit Region Admin</span>
          </h4>
        </div>
      </Header>

      <div className="flex h-[461px] w-full flex-col gap-[34px] overflow-auto bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="w-full text-xl font-semibold">Edit Regional Admin</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 grid-rows-4 gap-x-5"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="mb-[31px] flex flex-col gap-3">
                  <FormLabel className="text-sm text-black">First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="rounded bg-[#FFFFFF] shadow shadow-[#D9D9D9] placeholder:text-[#E6E6E6]"
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
                <FormItem className="mb-[31px] flex flex-col gap-3">
                  <FormLabel className="text-sm text-black">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="rounded bg-[#FFFFFF] shadow shadow-[#D9D9D9] placeholder:text-[#E6E6E6]"
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
                <FormItem className="mb-[31px] flex flex-col gap-3">
                  <FormLabel className="text-sm text-black">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="rounded bg-[#FFFFFF] shadow shadow-[#D9D9D9] placeholder:text-[#E6E6E6]"
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
                <FormItem className="mb-[31px] flex flex-col gap-3">
                  <FormLabel className="text-sm text-black">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className="rounded bg-[#FFFFFF] shadow shadow-[#D9D9D9] placeholder:text-[#E6E6E6]"
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
              name="permission"
              render={({ field }) => (
                <FormItem className="col-span-2 col-start-1 mb-[31px] flex flex-col gap-3">
                  <FormLabel className="text-sm text-black">Permission</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select a verified email to display" />
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

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditRegionAdmin
