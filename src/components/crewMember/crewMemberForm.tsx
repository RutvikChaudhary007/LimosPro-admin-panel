//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconAlignLeft,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import IntlTelInput from "intl-tel-input/react";
import { useFetchAllAffiliate } from "@/api";
import { Form, FormMessage } from "@/components/ui/form";
import isFieldDisabled from "@/utils/disableFormField";
import "intl-tel-input/styles";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import "../../assets/css/IntlTelInput.css";
import { Spinner } from "../Spinner";
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
  firstName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "First name cannot be empty or just whitespace.",
    })
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Last name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Last name must be at least 3 characters" }),
  description: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Description cannot be empty or just whitespace.",
    })
    .min(3, { message: "Description must be at least 3 characters" }),
  password: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Password cannot be empty or just whitespace.",
    })
    .min(3, { message: "Password must be at least 3 characters" }),
  email: z.email(),
  affiliateId: z
    .string()
    .min(3, { message: "Affiliate ID must be at least 3 characters" }),
  phone: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "phone cannot be empty or just whitespace.",
    })
    .min(8)
    .max(32),
});

export type TCrewMemberForm = z.infer<typeof formSchema>;
const CrewMemberForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: {
  initialData?: object;
  onSubmit: (data: TCrewMemberForm) => void;
  disabledFields?: [];
  type: string;
}) => {
  const { data: affiliateData, isFetching: isFetchingAffiliate } =
    useFetchAllAffiliate({ DateRange: {} });
  const transformInitialData = (data?: z.infer<typeof formSchema>) => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      firstName: data?.firstName,
      lastName: data?.lastName,
      description: data?.description,
      email: data?.email,
      phone: data?.phone,
      password: data?.password,
      affiliateId: data?.affiliateId ?? "",
    };
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      firstName: "",
      lastName: "",
      description: "",
      email: "",
      phone: "",
      password: "",
      affiliateId: "",
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data: TCrewMemberForm) => {
          try {
            await onSubmit(data);
          } catch (error) {
            console.error(error);
          }
        })}
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
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

                <FieldDescription> Enter the First Name. </FieldDescription>

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

                <FieldDescription> Enter the Last Name. </FieldDescription>

                {form.formState.errors.lastName && (
                  <FormMessage>
                    {form.formState.errors.lastName.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="description"
                  className="text-base-black gap-0"
                >
                  Description
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="description"
                        type="text"
                        placeholder="Description"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconAlignLeft />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the description.</FieldDescription>

                {form.formState.errors.description && (
                  <FormMessage>
                    {form.formState.errors.description.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-base-black gap-0">
                  Email
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the email address.</FieldDescription>

                {form.formState.errors.email && (
                  <FormMessage>
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" className="text-base-black gap-0">
                  Phone
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <InputGroup>
                      <IntlTelInput
                        initialValue={field.value}
                        onChangeNumber={(number) => field.onChange(number)}
                        initOptions={{
                          initialCountry: "us",
                          loadUtils: () =>
                            import(
                              "https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.1/build/js/utils.js"
                            ),
                        }}
                      />
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your phone number.</FieldDescription>

                {form.formState.errors.phone && (
                  <FormMessage>
                    {form.formState.errors.phone.message}
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

              {isFetchingAffiliate ? (
                <Spinner />
              ) : affiliateData?.affiliates.length > 0 ? (
                <Field>
                  <FieldLabel
                    htmlFor="affiliateId"
                    className="text-base-black gap-0"
                  >
                    Select Affiliate
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="affiliateId"
                    render={({ field }) => (
                      <SelectDropDown
                        placeholder="Select Affiliate"
                        items={
                          affiliateData?.affiliates?.map((a) => ({
                            label: a.companyName,
                            value: a.id,
                          })) || []
                        }
                        value={field.value}
                        setSelectedItem={(v) => field.onChange(v)}
                      />
                    )}
                  />

                  <FieldDescription>Select an affiliate.</FieldDescription>

                  {form.formState.errors.affiliateId && (
                    <FormMessage>
                      {form.formState.errors.affiliateId.message}
                    </FormMessage>
                  )}
                </Field>
              ) : (
                <Link to={constant.ROUTING_URLS.CREATE_AFFILIATE}>
                  <Label>Add Affiliate</Label>
                </Link>
              )}
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

export default CrewMemberForm;
