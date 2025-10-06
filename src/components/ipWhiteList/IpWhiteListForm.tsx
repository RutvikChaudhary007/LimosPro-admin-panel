import type { IIpWhiteListFormProps } from "@/types/ipWhiteList.type";
import z from "zod";
import type { TIpWhiteList } from "../table/column";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().refine(value => value.trim() !== "", {
        message: "Name cannot be empty or just whitespace.",
    }).min(3, { message: "Name must be at least 3 characters" }),
    ip: z.string().refine(value => value.trim() !== "", {
        message: "IP cannot be empty or just whitespace.",
    }).min(3, { message: "IP must be at least 3 characters" }),
    
});

export type TIpWhiteListForm = z.infer<typeof formSchema>;
const IpWhiteListForm = ({ initialData, onSubmit, disabledFields, type }:IIpWhiteListFormProps) => {
  const transformInitialData = (data?: TIpWhiteList): TIpWhiteListForm | undefined => {
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
             
         }
     });
 
 
 
     const handleFormSubmit: SubmitHandler<TIpWhiteListForm> = async (data: TIpWhiteListForm) => {
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
                 {/* IP White List Details */}
                 <Card className="overflow-y-auto rounded">
                     <CardHeader>
                         <CardTitle>{type}</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-6 gap-5">
                         <FormField
                             control={form.control}
                             name="name"
                             render={({ field }) => (
                                 <FormItem className="col-span-3 col-start-1">
                                     <FormLabel>Name</FormLabel>
                                     <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                         <Input
                                             placeholder="Aadmirals"
                                             disabled={isFieldDisabled(disabledFields, "name")}
                                             {...field}
                                         />
                                     </FormControl>
                                     <FormMessage
                                         className={`mt-1 h-5 ${form.formState.errors.name ? 'visible text-red-600' : 'invisible'
                                             }`}
                                     >
                                         {form.formState.errors.name?.message}
                                     </FormMessage>
                                 </FormItem>
                             )}
                         />
                         <FormField
                             control={form.control}
                             name="ip"
                             render={({ field }) => (
                                 <FormItem className="col-span-3 col-start-1">
                                     <FormLabel>IP</FormLabel>
                                     <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                                         <Input
                                             placeholder="IP Address"
                                             disabled={isFieldDisabled(disabledFields, "ip")}
                                             {...field}
                                         />
                                     </FormControl>
                                     <FormMessage
                                         className={`mt-1 h-5 ${form.formState.errors.ip ? 'visible text-red-600' : 'invisible'
                                             }`}
                                     >
                                         {form.formState.errors.ip?.message}
                                     </FormMessage>
                                 </FormItem>
                             )}
                         />
                    
                     </CardContent>
                     <div className="flex items-center justify-start rounded px-6 space-x-2.5">
                         <Button className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50" variant={"secondary"} type="button" onClick={() => {
                             form.reset({
                                name: "",
                                ip: "",
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

export default IpWhiteListForm
