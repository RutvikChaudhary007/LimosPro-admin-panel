import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandFacebookFilled,
  IconBrandGoogleFilled,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { passwordValidation } from "@/utils/password-validation";
import { FormMessage } from "./ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const signupSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z.email("Please enter a valid email address"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup data:", data);
    // Handle signup logic here
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      {...props}
    >
      <Card className="bg-base-white shadow-base-md w-full max-w-full rounded-[12px] border-0 p-8 sm:max-w-[480px]">
        {/* <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>
            We have emailed you a link to reset your password!
          </AlertTitle>
        </Alert> */}
        <CardHeader className="p-0 mb-6 text-left">
          <CardTitle className="text-base-black font-montserrat text-3xl leading-[100%] font-bold tracking-[0]">
            Sign Up with Email
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name" className="text-base-primary gap-0">
                  Full Name
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="name"
                        type="text"
                        placeholder="Enter a name"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUserCircle />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                {form.formState.errors.name && (
                  <FormMessage>
                    {form.formState.errors.name.message}
                  </FormMessage>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email" className="text-base-primary gap-0">
                  Email Address
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
                {form.formState.errors.email && (
                  <FormMessage>
                    {form.formState.errors.email.message}
                  </FormMessage>
                )}
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="font-quicksand text-base-primary text-base leading-[100%] font-bold"
                >
                  Password
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
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
                  Choose a strong password with at least 8 characters.
                </FieldDescription>
                {form.formState.errors.password && (
                  <FormMessage>
                    {form.formState.errors.password.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="font-quicksand text-base-primary text-base leading-[100%] font-bold"
                >
                  Confirm Password
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
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
                {form.formState.errors.confirmPassword && (
                  <FormMessage>
                    {form.formState.errors.confirmPassword.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <Button type="submit">Sign Up</Button>
              </Field>
              <FieldSeparator></FieldSeparator>
              <Field className="gap-4">
                <Button variant="outlinePrimary">
                  <IconBrandGoogleFilled />
                  <span>Sign up with Google</span>
                </Button>
                <Button variant="outlinePrimary">
                  <IconBrandFacebookFilled />
                  <span>Sign up with Facebook</span>
                </Button>
              </Field>
              <FieldSeparator></FieldSeparator>
              <Field>
                <FieldDescription className="text-base-black font-quicksand text-left text-base leading-[100%] font-medium">
                  Already have an Account?{" "}
                  <Link to="/auth/login" className="font-bold no-underline!">
                    Sign In
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="text-base-black font-quicksand text-center text-base leading-[100%] font-medium">
        By Signing up you agree to the{" "}
        <Link to="/terms-of-service" className="font-bold no-underline!">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="font-bold no-underline!">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
