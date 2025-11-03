import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import {
  IconBrandFacebookFilled,
  IconBrandGoogleFilled,
  IconEyeOff,
  IconLock,
  IconMail,
} from "@tabler/icons-react"
import { BadgeCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Alert, AlertTitle } from "./ui/alert"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>We have emailed you a link to reset your password!</AlertTitle>
        </Alert>

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
            <InputGroupInput id="email" type="email" placeholder="Email Address" required />
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
            <InputGroupInput id="password" type="password" placeholder="Password" required />
            <InputGroupAddon>
              <IconLock />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <IconEyeOff />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button type="submit">Log In</Button>
        </Field>
        <FieldSeparator></FieldSeparator>
        <Field className="gap-4">
          <Button variant="outlinePrimary">
            <IconBrandGoogleFilled />
            <span>Sign in with Google</span>
          </Button>
          <Button variant="outlinePrimary">
            <IconBrandFacebookFilled />
            <span>Sign in with Facebook</span>
          </Button>
        </Field>
        <Field className="gap-6">
          <FieldDescription className="text-base-black font-quicksand text-left text-base leading-[100%] font-bold">
            <Link to="/auth/forgot-password" className="no-underline!">
              Forgot Password?
            </Link>
          </FieldDescription>
          <FieldSeparator></FieldSeparator>
          <FieldDescription className="text-base-black font-quicksand text-left text-base leading-[100%] font-medium">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="font-bold no-underline!">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
