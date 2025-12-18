// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useFetchAllRegions, useFetchAllStaffRoles } from "@/api";
import { Form, FormMessage } from "@/components/ui/form";
import type { TStaffMemberForm } from "@/types/staffMember.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SelectDropDown } from "../ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Frist Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Email is required",
  }),
  password: z.string(),
  //     password: z.string()
  //   .min(8, { message: "Minimum length of 8" })
  //   .refine((pw) => /[A-Z]/.test(pw), { message: "Needs uppercase" })
  //   .refine((pw) => /[a-z]/.test(pw), { message: "Needs lowercase" })
  //   .refine((pw) => /\d/.test(pw), { message: "Needs a number" })
  //   .refine((pw) => /[!@#$%^&*]/.test(pw), { message: "Needs a special character" }),
  role: z.string(),
  region: z.string(),
});

const StaffMemberForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: TStaffMemberForm) => {
  const { data: regionsData, isFetching: isFetchingRegions } =
    useFetchAllRegions({ DateRange: {} });
  const { data: rolesData, isFetching: isFetchingRoles } =
    useFetchAllStaffRoles();
  const defaultValues = useMemo(() => {
    if (!initialData) {
      return {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        region: "",
      };
    }

    let roleValue = initialData?.user?.roles?.id ?? "";
    if (rolesData?.length > 0) {
      const foundRole = rolesData.find(
        (rawData) => rawData?.roleName === initialData?.user?.roles,
      );
      if (foundRole) {
        roleValue = foundRole.roleName;
      }
    }

    return {
      firstName: initialData?.user?.firstName || "",
      lastName: initialData?.user?.lastName || "",
      email: initialData?.user?.email || "",
      password: initialData?.password?.replace(/./g, "*") ?? "***********",
      role: roleValue,
      region: initialData?.region?.id ?? "",
    };
  }, [initialData, rolesData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    values: defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="firstName"
                  className="text-base-black gap-0"
                >
                  First Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        disabled={isFieldDisabled(disabledFields, "firstName")}
                        {...field}
                      />

                      <InputGroupAddon>
                        <IconUser />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the First Name.</FieldDescription>

                {form.formState.errors.firstName && (
                  <FormMessage>
                    {form.formState.errors.firstName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="lastName"
                  className="text-base-black gap-0"
                >
                  Last Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUser />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the Last Name.</FieldDescription>

                {form.formState.errors.lastName && (
                  <FormMessage>
                    {form.formState.errors.lastName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-base-black gap-0">
                  Email Address
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the Email Address.</FieldDescription>

                {form.formState.errors.lastName && (
                  <FormMessage>
                    {form.formState.errors.lastName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-base-black gap-0"
                >
                  Password
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...field}
                      />

                      <InputGroupAddon>
                        <IconLock />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your password.</FieldDescription>

                {form.formState.errors.password && (
                  <FormMessage>
                    {form.formState.errors.password.message}
                  </FormMessage>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="role" className="text-base-black gap-0">
                  Role
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Role"
                      items={
                        rolesData?.map((option) => ({
                          label: option?.roleName,
                          value: option?.roleName,
                        })) || []
                      }
                      value={field.value || ""}
                      setSelectedItem={(val) => field.onChange(val)}
                    />
                  )}
                />

                <FieldDescription>Select the Role.</FieldDescription>

                {form.formState.errors.role && (
                  <FormMessage>
                    {form.formState.errors.role.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="region" className="text-base-black gap-0">
                  Select Region
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <SelectDropDown
                      placeholder="Select Region"
                      items={
                        regionsData?.regions?.map((option) => ({
                          label: option?.regionName,
                          value: option?.id,
                        })) || []
                      }
                      value={field.value || ""}
                      setSelectedItem={(val) => field.onChange(val)}
                    />
                  )}
                />

                <FieldDescription>
                  Select the region for the user.
                </FieldDescription>

                {form.formState.errors.region && (
                  <FormMessage>
                    {form.formState.errors.region.message}
                  </FormMessage>
                )}
              </Field>
            </CardContent>
            <CardFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting
                  ? "Saving..."
                  : "Save Staff Member"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default StaffMemberForm;
