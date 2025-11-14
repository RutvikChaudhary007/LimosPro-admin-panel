import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import useFetchAllRegions from "@/api/region.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

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
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Error creating region admin",
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
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Region Management"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Region Management" },
          { label: "Add Regional Admin" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.REGION_ADMIN,
        }}
      />

      <Card>
        <CardBody>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardTitle>Create Regional Admin</CardTitle>

            <div className="grid grid-cols-2 gap-4 my-4">
              {/* First Name */}
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                      />
                    </InputGroup>
                  )}
                />
                <FieldDescription>Provide first name</FieldDescription>
                {form.formState.errors.firstName && (
                  <p className="text-base-danger text-sm mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </Field>

              {/* Last Name */}
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                      />
                    </InputGroup>
                  )}
                />
                <FieldDescription>Provide last name</FieldDescription>
                {form.formState.errors.lastName && (
                  <p className="text-base-danger text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Email"
                      />
                    </InputGroup>
                  )}
                />
                <FieldDescription>Provide email address</FieldDescription>
                {form.formState.errors.email && (
                  <p className="text-base-danger text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Password"
                      />
                    </InputGroup>
                  )}
                />
                <FieldDescription>Provide login password</FieldDescription>
                {form.formState.errors.password && (
                  <p className="text-base-danger text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </Field>

              {/* Region Select */}
              <Field>
                <FieldLabel htmlFor="region">Region</FieldLabel>
                <Controller
                  control={form.control}
                  name="region"
                  render={({ field }) => {
                    const options =
                      regionData?.regions?.map(
                        (r: { id: string; regionName: string }) => ({
                          value: r.id,
                          label: r.regionName,
                        }),
                      ) || [];

                    return regionFetching ? (
                      <Spinner />
                    ) : (
                      <SelectDropDown
                        placeholder="Select Region"
                        items={options}
                        value={field.value}
                        setSelectedItem={field.onChange}
                      />
                    );
                  }}
                />

                <FieldDescription>Select assigned region</FieldDescription>
                {form.formState.errors.region && (
                  <p className="text-base-danger text-sm mt-1">
                    {form.formState.errors.region.message}
                  </p>
                )}
              </Field>
            </div>

            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddRegionAdmin;
