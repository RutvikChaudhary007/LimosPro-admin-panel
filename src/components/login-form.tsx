import { zodResolver } from "@hookform/resolvers/zod";
import {
  // IconBrandFacebookFilled,
  // IconBrandGoogleFilled,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { BadgeCheck } from "lucide-react"
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  // FieldSeparator,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
// import { Alert, AlertTitle } from "./ui/alert"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  // remember: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onSubmit: (data: LoginFormValues) => void; // this is our custom handler
  loading: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  loading,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      // remember: false,
      password: "",
      email: localStorage.getItem("Email") || "",
    },
  });
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>We have emailed you a link to reset your password!</AlertTitle>
        </Alert> */}

        <div className="text-left">
          <h1 className="text-base-black font-montserrat text-3xl leading-[100%] font-bold tracking-[0]">
            Login to your account
          </h1>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="text-base-primary gap-0">
            Email Address
            <span className="text-base-danger ml-1">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="Email Address"
              required
              {...form.register("email")}
            />
            <InputGroupAddon>
              <IconMail />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="password" className="text-base-primary gap-0">
            Password
            <span className="text-base-danger ml-1">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              {...form.register("password")}
            />
            <InputGroupAddon>
              <IconLock />
            </InputGroupAddon>
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEye /> : <IconEyeOff />}
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button type="submit">{loading ? "Submitting..." : "Log In"}</Button>
        </Field>
        {/* <FieldSeparator></FieldSeparator> */}
        {/* <Field className="gap-4">
          <Button variant="outlinePrimary">
            <IconBrandGoogleFilled />
            <span>Sign in with Google</span>
          </Button>
          <Button variant="outlinePrimary">
            <IconBrandFacebookFilled />
            <span>Sign in with Facebook</span>
          </Button>
        </Field> */}
        <Field className="gap-6">
          <FieldDescription className="text-base-black font-quicksand text-left text-base leading-[100%] font-bold">
            <Link to="/auth/forgot-password" className="no-underline!">
              Forgot Password?
            </Link>
          </FieldDescription>
          {/* <FieldSeparator></FieldSeparator>
          <FieldDescription className="text-base-black font-quicksand text-left text-base leading-[100%] font-medium">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="font-bold no-underline!">
              Sign up
            </Link>
          </FieldDescription> */}
        </Field>
      </FieldGroup>
    </form>
  );
}
