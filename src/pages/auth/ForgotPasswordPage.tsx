import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-base-background-light flex min-h-[calc(100svh-66px)] flex-col items-center justify-center py-8">
      <div className="bg-base-white shadow-base-md w-full max-w-[480px] rounded-[12px] p-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
