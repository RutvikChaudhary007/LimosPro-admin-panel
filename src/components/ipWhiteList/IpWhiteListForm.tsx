import { zodResolver } from "@hookform/resolvers/zod";
import { IconServer, IconUser } from "@tabler/icons-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { IIpWhiteListFormProps } from "@/types/ipWhiteList.type";
import isFieldDisabled from "@/utils/disableFormField";
import type { TIpWhiteList } from "../table/column";
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
import { Form, FormMessage } from "../ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

const formSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  ip: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "IP cannot be empty or just whitespace.",
    })
    .min(3, { message: "IP must be at least 3 characters" }),
});

export type TIpWhiteListForm = z.infer<typeof formSchema>;
const IpWhiteListForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: IIpWhiteListFormProps) => {
  const transformInitialData = (
    data?: TIpWhiteList,
  ): TIpWhiteListForm | undefined => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      name: data?.name,
      ip: data?.ip,
    };
  };
  const form = useForm<TIpWhiteListForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      name: "",
      ip: "",
    },
  });

  const handleFormSubmit: SubmitHandler<TIpWhiteListForm> = async (
    data: TIpWhiteListForm,
  ) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(handleFormSubmit)(e)}>
        {/* IP White List Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="name" className="text-base-black gap-0">
                  Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="name"
                        type="text"
                        placeholder="Add Name"
                        disabled={isFieldDisabled(disabledFields, "name")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUser /> {/* Example icon for name */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the full name here.</FieldDescription>

                {form.formState.errors.name && (
                  <FormMessage>
                    {form.formState.errors.name.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="ip" className="text-base-black gap-0">
                  IP
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="ip"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="ip"
                        type="text"
                        placeholder="IP Address"
                        disabled={isFieldDisabled(disabledFields, "ip")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconServer />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the IP address here.</FieldDescription>

                {form.formState.errors.ip && (
                  <FormMessage>{form.formState.errors.ip.message}</FormMessage>
                )}
              </Field>
            </CardContent>
            <CardFooter className="flex items-center justify-start gap-2.5">
              <Button
                variant="outlinePrimary"
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                Clear Alls
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default IpWhiteListForm;
