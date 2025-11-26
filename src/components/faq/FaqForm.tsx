import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconHelpCircle } from "@tabler/icons-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { IFaqFormProps } from "@/types/faq.type";
import isFieldDisabled from "@/utils/disableFormField";
import type { TFaqs } from "../table/column";
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
  question: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Question cannot be empty or just whitespace.",
    })
    .min(3, { message: "Question must be at least 3 characters" }),
  answer: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Answer cannot be empty or just whitespace.",
    })
    .min(3, { message: "Answer must be at least 3 characters" }),
});

export type TFaqForm = z.infer<typeof formSchema>;

const FaqForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: IFaqFormProps) => {
  const transformInitialData = (data?: TFaqs): TFaqForm | undefined => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      question: data?.question,
      answer: data?.answer,
    };
  };
  const form = useForm<TFaqForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      question: "",
      answer: "",
    },
  });

  const handleFormSubmit: SubmitHandler<TFaqForm> = async (data: TFaqForm) => {
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
        {/* Question */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="question"
                  className="text-base-black gap-0"
                >
                  Question
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="question"
                        type="text"
                        placeholder="Write a Question"
                        disabled={isFieldDisabled(disabledFields, "question")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconHelpCircle />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your question here.</FieldDescription>

                {form.formState.errors.question && (
                  <FormMessage>
                    {form.formState.errors.question.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="answer" className="text-base-black gap-0">
                  Answer
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="answer"
                        type="text"
                        placeholder="Write an Answer"
                        disabled={isFieldDisabled(disabledFields, "answer")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconEdit />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the answer here.</FieldDescription>

                {form.formState.errors.answer && (
                  <FormMessage>
                    {form.formState.errors.answer.message}
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

export default FaqForm;
