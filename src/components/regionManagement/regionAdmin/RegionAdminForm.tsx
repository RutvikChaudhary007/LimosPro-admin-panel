import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useFetchAllRegions } from "@/api";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import type { TRegionAdminRes } from "@/types/regionManagement/reginAdmin/regionAdmin.type";
import { passwordValidation } from "@/utils/password-validation";

export type TRegionAdmin = {
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  password: string;
};

const getFormSchema = (isEditMode: boolean) =>
  z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: isEditMode
      ? z.string().optional()
      : z.email({ message: "Please enter a valid email address" }),
    region: z.string().min(1, "Region is required"),
    password: isEditMode ? z.string().optional() : passwordValidation,
  });

type TRegionAdminFormProps = {
  initialData?: TRegionAdminRes;
  title: string;
  onSubmit: (data: TRegionAdmin) => Promise<void>;
};

const transformInitialData = (
  data?: TRegionAdminRes,
): TRegionAdmin | undefined => {
  // console.log("initial data:", data);
  if (!data) return undefined;

  return {
    region: data?.region?.id ?? "",
    email: data?.user?.email ?? "",
    firstName: data?.user?.firstName ?? "",
    lastName: data?.user?.lastName ?? "",
    password: "",
  };
};

function RegionAdminForm({
  initialData,
  title,
  onSubmit,
}: Readonly<TRegionAdminFormProps>) {
  const { data: regionData, isFetching: regionFetching } = useFetchAllRegions({
    limit: 100,
  });

  // Determine if this is edit mode
  const isEditMode = !!initialData;

  const [showPassword, setShowPassword] = useState(false);
  const [isRegionChangeDialogOpen, setIsRegionChangeDialogOpen] =
    useState(false);
  const [pendingSubmitData, setPendingSubmitData] =
    useState<TRegionAdmin | null>(null);

  const resolver = useMemo(() => {
    return zodResolver(getFormSchema(isEditMode));
  }, [isEditMode]);

  const form = useForm<TRegionAdmin>({
    resolver: resolver as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      region: "",
      password: "",
    },
  });

  // Reset form when BOTH initialData and regionData are available
  useEffect(() => {
    if (initialData && regionData?.regions) {
      const transformedData = transformInitialData(initialData);
      if (transformedData) {
        form.reset(transformedData);
      }
    }
  }, [initialData, regionData, form]);

  const initialRegionId = useMemo(
    () => initialData?.region?.id ?? "",
    [initialData?.region?.id],
  );

  const handleFormSubmit = async (data: TRegionAdmin) => {
    if (isEditMode) {
      // In edit mode, exclude email and password from payload
      const { password, email, ...dataWithoutSensitiveFields } = data;
      const regionChanged =
        !!initialRegionId && data.region !== initialRegionId;
      if (regionChanged) {
        setPendingSubmitData(dataWithoutSensitiveFields as TRegionAdmin);
        setIsRegionChangeDialogOpen(true);
        return;
      }
      await onSubmit(dataWithoutSensitiveFields as TRegionAdmin);
      return;
    }

    await onSubmit(data);
  };

  const passwordPlaceholder = useMemo(() => {
    return isEditMode
      ? "Leave blank to keep current password"
      : "Enter password";
  }, [isEditMode]);

  const passwordDescription = useMemo(() => {
    return isEditMode
      ? "Leave as is to keep current password, or enter a new one to change it"
      : "Choose a strong password with at least 8 characters.";
  }, [isEditMode]);

  return (
    <Card>
      <CardBody>
        <div>
          <CardTitle>{title}</CardTitle>

          <div className="grid grid-cols-2 gap-4 my-4">
            {/* First Name */}
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                    />
                  </InputGroup>
                )}
              />
              <FieldDescription>Provide first name</FieldDescription>
              {form.formState.errors.firstName && (
                <p className="text-base-danger text-sm">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Controller
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                    />
                  </InputGroup>
                )}
              />
              <FieldDescription>Provide last name</FieldDescription>
              {form.formState.errors.lastName && (
                <p className="text-base-danger text-sm">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Email"
                      disabled={isEditMode}
                    />
                  </InputGroup>
                )}
              />
              <FieldDescription>
                {isEditMode
                  ? "Email cannot be changed in edit mode"
                  : "Provide email address"}
              </FieldDescription>
              {form.formState.errors.email && (
                <p className="text-base-danger text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={passwordPlaceholder}
                      disabled={isEditMode}
                    />
                    <InputGroupAddon>
                      <IconLock />
                    </InputGroupAddon>
                    <InputGroupAddon
                      align="inline-end"
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IconEyeOff /> : <IconEye />}
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              <FieldDescription>
                {isEditMode
                  ? "Password cannot be changed in edit mode"
                  : passwordDescription}
              </FieldDescription>
              {form.formState.errors.password && (
                <p className="text-base-danger text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>

            {/* Region Select */}
            <Field>
              <FieldLabel htmlFor="region">Region</FieldLabel>
              <Controller
                control={form.control}
                name="region"
                render={({ field }) => {
                  const options =
                    regionData?.regions?.map(
                      (r: { id: string; regionName: string }) => ({
                        value: r.id,
                        label: r.regionName,
                      }),
                    ) || [];

                  //   // Debug logs
                  //   console.log("Current field value:", field.value);
                  //   console.log("Available options:", options);
                  //   console.log(
                  //     "Matched option:",
                  //     options.find((opt) => opt.value === field.value),
                  //   );

                  return regionFetching ? (
                    <Spinner />
                  ) : (
                    <SelectDropDown
                      placeholder="Select Region"
                      items={options}
                      value={field.value}
                      setSelectedItem={field.onChange}
                    />
                  );
                }}
              />

              <FieldDescription>Select assigned region</FieldDescription>
              {form.formState.errors.region && (
                <p className="text-base-danger text-sm">
                  {form.formState.errors.region.message}
                </p>
              )}
            </Field>
          </div>

          <CardFooter>
            <Button
              type="button"
              onClick={() => form.handleSubmit(handleFormSubmit as any)()}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </CardFooter>
          <Dialog
            open={isRegionChangeDialogOpen}
            onOpenChange={setIsRegionChangeDialogOpen}
          >
            <DialogContent
              className="w-full sm:max-w-sm"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Confirm Region Change</DialogTitle>
                <DialogDescription>
                  Changing the region will reset this user's permissions to
                  role-based permissions for the selected region. Any custom
                  permissions will be lost. Do you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outlinePrimary">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!pendingSubmitData) return;
                    setIsRegionChangeDialogOpen(false);
                    await onSubmit(pendingSubmitData);
                    setPendingSubmitData(null);
                  }}
                >
                  Confirm & Reset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardBody>
    </Card>
  );
}

export default RegionAdminForm;
