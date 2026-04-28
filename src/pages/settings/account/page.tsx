"use client";

import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { changePassword, deleteProfile, updateProfile } from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { tokenManager } from "@/services/tokenManager";
import { useUserStore } from "@/stores/useAuthStore";
import { safeZodResolver } from "@/utils/safeZodResolver";
import { generatePageTitle } from "@/utils/seo";

const accountFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasAnyPassword =
        !!data.currentPassword || !!data.newPassword || !!data.confirmPassword;
      if (!hasAnyPassword) return true;
      return (
        !!data.currentPassword && !!data.newPassword && !!data.confirmPassword
      );
    },
    {
      message: "Please complete all password fields",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<AccountFormValues>({
    resolver: safeZodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [form, user]);

  const onSubmit = async (data: AccountFormValues) => {
    const shouldUpdateProfile =
      data.firstName !== user?.firstName || data.lastName !== user?.lastName;
    const shouldChangePassword =
      !!data.currentPassword && !!data.newPassword && !!data.confirmPassword;

    if (!shouldUpdateProfile && !shouldChangePassword) {
      return;
    }

    try {
      setIsSaving(true);

      if (shouldUpdateProfile) {
        await toastPromise(
          updateProfile({
            firstName: data.firstName,
            lastName: data.lastName,
          }),
          {
            loading: "Updating profile...",
            success: "Profile updated successfully.",
            error: (e) =>
              e instanceof AxiosError
                ? e.response?.data?.data?.error || e.response?.data?.message
                : "Failed to update profile.",
          },
        );

        setUser(
          user
            ? {
                ...user,
                firstName: data.firstName,
                lastName: data.lastName,
              }
            : user,
        );
      }

      if (shouldChangePassword) {
        await toastPromise(
          changePassword({
            oldPassword: data.currentPassword || "",
            newPassword: data.newPassword || "",
          }),
          {
            loading: "Updating password...",
            success: "Password updated successfully.",
            error: (e) =>
              e instanceof AxiosError
                ? e.response?.data?.data?.error || e.response?.data?.message
                : "Failed to update password.",
          },
        );

        form.setValue("currentPassword", "");
        form.setValue("newPassword", "");
        form.setValue("confirmPassword", "");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      if (!user?.id) {
        return;
      }
      await toastPromise(deleteProfile(user.id, true), {
        loading: "Deleting account...",
        success: "Account deleted successfully.",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Failed to delete account.",
      });

      tokenManager.clear();
      localStorage.clear();
      setUser(null);
      setIsDeleteDialogOpen(false);
      navigate(constant.ROUTING_URLS.ADMIN_LOGIN);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Account Settings")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Account Settings"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Account Settings" },
          ]}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information that will be displayed on
                    your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  </div>
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-base-black gap-0"
                    >
                      Email Address
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            disabled
                          />
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>Provide email address</FieldDescription>
                    {form.formState.errors.email && (
                      <p className="text-base-danger text-sm">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </Field>
                </CardContent>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel
                      htmlFor="currentPassword"
                      className="text-base-black gap-0"
                    >
                      Current Password
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                          />
                          <InputGroupAddon>
                            <IconLock />
                          </InputGroupAddon>
                          <InputGroupAddon
                            align="inline-end"
                            className="cursor-pointer"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? <IconEyeOff /> : <IconEye />}
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>
                      Provide current password
                    </FieldDescription>
                    {form.formState.errors.currentPassword && (
                      <p className="text-base-danger text-sm">
                        {form.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="newPassword"
                      className="text-base-black gap-0"
                    >
                      New Password
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                          />
                          <InputGroupAddon>
                            <IconLock />
                          </InputGroupAddon>
                          <InputGroupAddon
                            align="inline-end"
                            className="cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <IconEyeOff /> : <IconEye />}
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>Provide new password</FieldDescription>
                    {form.formState.errors.newPassword && (
                      <p className="text-base-danger text-sm">
                        {form.formState.errors.newPassword.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="text-base-black gap-0"
                    >
                      Confirm New Password
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                          />
                          <InputGroupAddon>
                            <IconLock />
                          </InputGroupAddon>
                          <InputGroupAddon
                            align="inline-end"
                            className="cursor-pointer"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>Confirm new password</FieldDescription>
                    {form.formState.errors.confirmPassword && (
                      <p className="text-base-danger text-sm">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </Field>
                </CardContent>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                    <Dialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          type="button"
                          className="cursor-pointer"
                        >
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="w-full sm:max-w-sm"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <DialogHeader>
                          <DialogTitle>Delete Account</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Are you absolutely sure?</strong> This
                            action cannot be undone.
                          </p>
                        </div>
                        <DialogFooter className="mt-6">
                          <DialogClose asChild>
                            <Button
                              variant="outlinePrimary"
                              disabled={isDeleting}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleDeleteAccount}
                          >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </CardBody>
            </Card>

            <div className="flex space-x-2">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isSaving}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                type="reset"
                className="cursor-pointer"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
