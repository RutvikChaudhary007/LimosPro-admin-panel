import { IconNews } from "@tabler/icons-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { INewsFormProps } from "@/types/news.type";
import isFieldDisabled from "@/utils/disableFormField";
import { safeZodResolver } from "@/utils/safeZodResolver";
import type { TNews } from "../table/column";
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
  news: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "News cannot be empty or just whitespace.",
    })
    .min(3, { message: "News must be at least 3 characters" }),
});

export type TNewsForm = z.infer<typeof formSchema>;

const NewsForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: INewsFormProps) => {
  const transformInitialData = (data?: TNews): TNewsForm | undefined => {
    if (!data) return undefined;
    return {
      news: data?.body,
    };
  };
  const form = useForm<TNewsForm>({
    resolver: safeZodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      news: "",
    },
  });

  const handleFormSubmit: SubmitHandler<TNewsForm> = async (
    data: TNewsForm,
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
        {/* News Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="news" className="text-base-black gap-0">
                  Add News
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="news"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="news"
                        type="text"
                        placeholder="Write News here"
                        disabled={isFieldDisabled(disabledFields, "news")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconNews />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the latest news here.</FieldDescription>

                {form.formState.errors.news && (
                  <FormMessage>
                    {form.formState.errors.news.message}
                  </FormMessage>
                )}
              </Field>
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
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

export default NewsForm;
