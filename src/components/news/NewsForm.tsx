import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { INewsFormProps } from "@/types/news";
import type { TNews } from "../table/column";


const formSchema = z.object({
    news: z.string().refine(value => value.trim() !== "", {
        message: "News cannot be empty or just whitespace.",
    }).min(3, { message: "News must be at least 3 characters" }),
    
});

export type TNewsForm = z.infer<typeof formSchema>;

const NewsForm = ({ initialData, onSubmit, disabledFields, type }: INewsFormProps) => {
     const transformInitialData = (data?: TNews): TNewsForm | undefined => {
         if (!data) return undefined;
         // console.log("edit chauffeur formdata:>",data)
         return {
             news: data?.news,
         };
 
     };
     const form = useForm<TNewsForm>({
         resolver: zodResolver(formSchema),
         defaultValues: transformInitialData(initialData) || {
             news: "",
             
         }
     });
 
 
 
     const handleFormSubmit: SubmitHandler<TNewsForm> = async (data: TNewsForm) => {
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
                 {/* News Details */}
                 <Card className="overflow-y-auto rounded">
                     <CardHeader>
                         <CardTitle>{type}</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-6 gap-5">
                         <FormField
                             control={form.control}
                             name="news"
                             render={({ field }) => (
                                 <FormItem className="col-span-3 col-start-1">
                                     <FormLabel>Add News:</FormLabel>
                                     <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                         <Input
                                             placeholder="Write News here"
                                             disabled={isFieldDisabled(disabledFields, "news")}
                                             {...field}
                                         />
                                     </FormControl>
                                     <FormMessage
                                         className={`mt-1 h-5 ${form.formState.errors.news ? 'visible text-red-600' : 'invisible'
                                             }`}
                                     >
                                         {form.formState.errors.news?.message}
                                     </FormMessage>
                                 </FormItem>
                             )}
                         />
                    
                     </CardContent>
                     <div className="flex items-center justify-start rounded px-6 space-x-2.5">
                         <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="button" onClick={() => {
                             form.reset({
                                news: "",
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

export default NewsForm
