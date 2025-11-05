import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  IconUserCircle,
} from "@tabler/icons-react"
import { BadgeCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Alert, AlertTitle } from "./ui/alert"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)} {...props}>
      <Card className="bg-base-white shadow-base-light w-full max-w-full rounded-[12px] border-0 p-8 sm:max-w-[480px]">
        <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>We have emailed you a link to reset your password!</AlertTitle>
        </Alert>
        <CardHeader className="text-left">
          <CardTitle className="text-base-black font-montserrat text-3xl leading-[100%] font-bold tracking-[0]">
            Sign Up with Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name" className="text-base-primary gap-0">
                  Full Name
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput id="name" type="text" placeholder="Enter a name" required />
                  <InputGroupAddon>
                    <IconUserCircle />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
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
                <FieldLabel
                  htmlFor="password"
                  className="font-quicksand text-base-primary text-base leading-[100%] font-bold"
                >
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
                <FieldLabel
                  htmlFor="confirm-password"
                  className="font-quicksand text-base-primary text-base leading-[100%] font-bold"
                >
                  Confirm Password
                  <span className="text-base-danger ml-1">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                  <InputGroupAddon>
                    <IconLock />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <IconEyeOff />
                  </InputGroupAddon>
                </InputGroup>
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
  )
}
