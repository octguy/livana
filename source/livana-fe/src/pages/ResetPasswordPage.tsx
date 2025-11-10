import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
