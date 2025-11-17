import { zodResolver } from "@hookform/resolvers/zod";
import { MapPinned } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { TRegionRes } from "@/types/regionManagement/region/region.type";

const formSchema = z.object({
  regionName: z.string().min(2, {
    message: "Region name must be at least 2 characters.",
  }),
});
export type TRegion = z.infer<typeof formSchema>;

type TRegionFormProps = {
  initialData?: TRegionRes;
  title: string;
  onSubmit: (data: TRegion) => void;
};

const transformInitialData = (data?: TRegionRes): TRegion | undefined => {
  if (!data) return undefined;
  console.log("initial data:", data);

  return {
    regionName: data?.regionName ?? "",
  };
};

function RegionForm({ initialData, title, onSubmit }: TRegionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      regionName: "",
    },
  });
  return (
    <Card>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardTitle>{title}</CardTitle>
          <div className="space-y-4 my-4">
            <Field>
              <FieldLabel
                htmlFor="regionName"
                className="text-base-black gap-0"
              >
                Region
              </FieldLabel>

              <Controller
                control={form.control}
                name="regionName"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="regionName"
                      type="text"
                      placeholder="Add Region"
                    />
                    <InputGroupAddon>
                      <MapPinned />
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />

              <FieldDescription className="mt-1">
                Provide region name here.
              </FieldDescription>

              {form.formState.errors.regionName && (
                <p className="text-danger text-sm mt-1">
                  {form.formState.errors.regionName.message}
                </p>
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
  );
}

export default RegionForm;
