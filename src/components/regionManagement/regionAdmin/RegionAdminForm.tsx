import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchAllRegions } from "@/api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import type { TRegionAdminRes } from "@/types/regionManagement/reginAdmin/regionAdmin.type";

// Single unified schema that handles both create and edit modes
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.email({ message: "Please enter a valid email address" }),
  region: z.string().min(1, "Region is required"),
  password: z.string().refine(
    (val) => {
      // If it's the placeholder, it's valid (edit mode, unchanged)
      if (val === "**********") return true;

      // If empty, it's invalid (required for create mode)
      if (!val || val.trim() === "") return false;

      // If provided, must meet all requirements
      return (
        val.length >= 7 &&
        val.length <= 25 &&
        /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/]/.test(val)
      );
    },
    {
      message:
        "Password must be 7-25 characters with uppercase, lowercase, number, and special character.",
    },
  ),
});

export type TRegionAdmin = z.infer<typeof formSchema>;

type TRegionAdminFormProps = {
  initialData?: TRegionAdminRes;
  title: string;
  onSubmit: (data: TRegionAdmin) => Promise<void>;
};

const transformInitialData = (
  data?: TRegionAdminRes,
): TRegionAdmin | undefined => {
  //   console.log("initial data:", data);
  if (!data) return undefined;

  return {
    region: data?.region?.id ?? "",
    email: data?.user?.email ?? "",
    firstName: data?.user?.firstName ?? "",
    lastName: data?.user?.lastName ?? "",
    password: "**********", // Placeholder for edit mode
  };
};

function RegionAdminForm({
  initialData,
  title,
  onSubmit,
}: Readonly<TRegionAdminFormProps>) {
  const { data: regionData, isFetching: regionFetching } = useFetchAllRegions({
    limit: 100,
  });

  // Determine if this is edit mode
  const isEditMode = !!initialData;

  const form = useForm<TRegionAdmin>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      region: "",
      password: "",
    },
  });

  // Reset form when BOTH initialData and regionData are available
  useEffect(() => {
    if (initialData && regionData?.regions) {
      const transformedData = transformInitialData(initialData);
      if (transformedData) {
        form.reset(transformedData);
      }
    }
  }, [initialData, regionData, form]);

  const handleFormSubmit = async (data: TRegionAdmin) => {
    // If in edit mode and password is the placeholder, don't send it
    if (isEditMode && data.password === "**********") {
      const { password, ...dataWithoutPassword } = data;
      await onSubmit(dataWithoutPassword as TRegionAdmin);
    } else {
      await onSubmit(data);
    }
  };

  const passwordPlaceholder = useMemo(() => {
    return isEditMode
      ? "Leave blank to keep current password"
      : "Enter password";
  }, [isEditMode]);

  const passwordDescription = useMemo(() => {
    return isEditMode
      ? "Leave as is to keep current password, or enter a new one to change it"
      : "Provide login password (min 7 chars, with uppercase, lowercase, number, special char)";
  }, [isEditMode]);

  return (
    <Card>
      <CardBody>
        <div>
          <CardTitle>{title}</CardTitle>

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
                <p className="text-base-danger text-sm">
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
                <p className="text-base-danger text-sm">
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
                <p className="text-base-danger text-sm">
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
                      placeholder={passwordPlaceholder}
                    />
                  </InputGroup>
                )}
              />
              <FieldDescription>{passwordDescription}</FieldDescription>
              {form.formState.errors.password && (
                <p className="text-base-danger text-sm">
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

                  //   // Debug logs
                  //   console.log("Current field value:", field.value);
                  //   console.log("Available options:", options);
                  //   console.log(
                  //     "Matched option:",
                  //     options.find((opt) => opt.value === field.value),
                  //   );

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
                <p className="text-base-danger text-sm">
                  {form.formState.errors.region.message}
                </p>
              )}
            </Field>
          </div>

          <CardFooter>
            <Button
              type="button"
              onClick={() => form.handleSubmit(handleFormSubmit)()}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </CardFooter>
        </div>
      </CardBody>
    </Card>
  );
}

export default RegionAdminForm;
