import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IFaqFormProps } from "@/types/faq";
import type { TFaqs } from "../table/column";

const formSchema = z.object({
    question: z.string().refine(value => value.trim() !== "", {
        message: "Question cannot be empty or just whitespace.",
    }).min(3, { message: "Question must be at least 3 characters" }),
    answer: z.string().refine(value => value.trim() !== "", {
        message: "Answer cannot be empty or just whitespace.",
    }).min(3, { message: "Answer must be at least 3 characters" }),
    
});

export type TFaqForm = z.infer<typeof formSchema>;


const FaqForm = ({ initialData, onSubmit, disabledFields, type }: IFaqFormProps) => {
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
             
         }
     });
 
 
 
     const handleFormSubmit: SubmitHandler<TFaqForm> = async (data: TFaqForm) => {
         try {
             await onSubmit(data);
             form.reset();
         } catch (error) {
             console.error("Error:", error)
         }
     }
     return (
         <Form {...form}>
             <form onSubmit={e => void form.handleSubmit(handleFormSubmit)(e)}>
                 {/* Question */}
                 <Card className="overflow-y-auto rounded">
                     <CardHeader>
                         <CardTitle>{type}</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-6 gap-5">
                         <FormField
                             control={form.control}
                             name="question"
                             render={({ field }) => (
                                 <FormItem className="col-span-3 col-start-1">
                                     <FormLabel>Question</FormLabel>
                                     <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                         <Input
                                             placeholder="Write a Question"
                                             disabled={isFieldDisabled(disabledFields, "question")}
                                             {...field}
                                         />
                                     </FormControl>
                                     <FormMessage
                                         className={`mt-1 h-5 ${form.formState.errors.question ? 'visible text-red-600' : 'invisible'
                                             }`}
                                     >
                                         {form.formState.errors.question?.message}
                                     </FormMessage>
                                 </FormItem>
                             )}
                         />
                         <FormField
                             control={form.control}
                             name="answer"
                             render={({ field }) => (
                                 <FormItem className="col-span-3 col-start-1">
                                     <FormLabel>Answer</FormLabel>
                                     <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                         <Input
                                             placeholder="Write an Answer"
                                             disabled={isFieldDisabled(disabledFields, "answer")}
                                             {...field}
                                         />
                                     </FormControl>
                                     <FormMessage
                                         className={`mt-1 h-5 ${form.formState.errors.answer ? 'visible text-red-600' : 'invisible'
                                             }`}
                                     >
                                         {form.formState.errors.answer?.message}
                                     </FormMessage>
                                 </FormItem>
                             )}
                         />
                    
                     </CardContent>
                     <div className="flex items-center justify-start rounded px-6 space-x-2.5">
                         <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="button" onClick={() => {
                             form.reset({
                                question: "",
                                answer: "",
                             });
 
                         }} >
                             Clear Alls
                         </Button>
                         <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="submit" disabled={form.formState.isSubmitting}>
                             {form.formState.isSubmitting ? "Saving..." : "Save Details"}
                         </Button>
                     </div>
                 </Card>
             </form>
         </Form>
     )
}

export default FaqForm
