import { SignupForm } from "@/components/signup-form"

export default function RegisterPage() {
  return (
    <div className="bg-base-background-light flex min-h-[calc(100svh-66px)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-3/4 sm:max-w-[550px]">
        <SignupForm />
      </div>
    </div>
  )
}
