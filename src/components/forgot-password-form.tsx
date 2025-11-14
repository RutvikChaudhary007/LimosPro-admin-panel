import { IconMail } from "@tabler/icons-react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle } from "./ui/alert";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>
            We have emailed you a link to reset your password!
          </AlertTitle>
        </Alert>
        <div className="text-base-black space-y-6 text-left">
          <h1 className="font-montserrat text-3xl leading-[100%] font-bold tracking-[0]">
            Forgot Password?
          </h1>
          <p className="font-quicksand text-base leading-[100%] font-medium tracking-[0]">
            Enter the email address associated with your account and we will
            send you a link to reset your password.
          </p>
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
            />
            <InputGroupAddon>
              <IconMail />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button type="submit">Request Password Reset</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
