import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MapPinned } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
});
export type TRegion = z.infer<typeof formSchema>;
function AddRegionPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regionName: "",
    },
  });
  const createRegion = queries.useCreateRegionMutation();
  async function onSubmit(values: TRegion) {
    try {
      toastPromise(createRegion.mutateAsync(values), {
        loading: "Creating region...",
        success: (res) => {
          if (res?.status === true) {
            navigate(constant.ROUTING_URLS.REGION);
          }
          return "Yeah! Region created successfully";
        },
        error: (e) => (e instanceof Error ? e.message : "Opps! Failed to create region"),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Region Management"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Region Management" }, { label: "Add Regions" }]}
          action={{
            variant: "outlineBlack",
            label: "Back to Regions",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.REGION,
          }}
        />

        <Card>
          <CardBody>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardTitle>Create Regions</CardTitle>
              <div className="space-y-4 my-4">
                <Field>
                  <FieldLabel htmlFor="regionName" className="text-base-black gap-0">
                    Region
                  </FieldLabel>

                  <Controller
                    control={form.control}
                    name="regionName"
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupInput {...field} id="regionName" type="text" placeholder="Add Region" />
                        <InputGroupAddon>
                          <MapPinned />
                        </InputGroupAddon>
                      </InputGroup>
                    )}
                  />

                  <FieldDescription className="mt-1">Provide region name here.</FieldDescription>

                  {form.formState.errors.regionName && (
                    <p className="text-danger text-sm mt-1">{form.formState.errors.regionName.message}</p>
                  )}
                </Field>
              </div>

              <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Region"}
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default AddRegionPage;
