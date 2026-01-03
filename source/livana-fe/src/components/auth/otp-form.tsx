import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader2, GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/stores/useAuthStore";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const { verifyEmail, resendVerificationCode } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state
  const email = (location.state as { email?: string })?.email;

  const [otpValue, setOtpValue] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect to login if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setVerifyError("Invalid email. Please register again.");
      return;
    }

    if (otpValue.length !== 6) {
      setVerifyError("Please enter all 6 digits");
      return;
    }

    try {
      console.log("Submitting OTP:", otpValue);
      console.log("Email for verification:", email);
      setIsSubmitting(true);
      setVerifyError(null);
      setResendSuccess(null);
      await verifyEmail(email, otpValue);
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      if (status === 400) {
        setVerifyError("Invalid or expired verification code");
      } else if (status === 404) {
        setVerifyError("Verification request not found");
      } else if (status === 500) {
        setVerifyError("Server error. Please try again later.");
      } else if (error?.response?.data?.message) {
        setVerifyError(String(error.response.data.message));
      } else {
        setVerifyError("Verification failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setVerifyError("Invalid email. Please register again.");
      return;
    }

    try {
      setIsResending(true);
      setVerifyError(null);
      setResendSuccess(null);
      await resendVerificationCode(email);
      setResendSuccess("A new verification code has been sent to your email");
      setOtpValue("");
      console.log("Resend code functionality is not implemented yet.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      if (status === 429) {
        setVerifyError("Please wait before requesting a new code");
      } else if (status === 500) {
        setVerifyError("Server error. Please try again later.");
      } else {
        setVerifyError("Unable to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setVerifyError(null);
    setResendSuccess(null);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Verify Your Account</h1>
            <FieldDescription>
              {email
                ? `We sent a 6-digit code to ${email}`
                : "Please enter the 6-digit verification code"}
            </FieldDescription>
          </div>

          {/* Show verify error */}
          {verifyError && (
            <div className="text-destructive text-sm font-semibold bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center">
              {verifyError}
            </div>
          )}

          {/* Show resend success */}
          {resendSuccess && (
            <div className="text-green-600 text-sm font-semibold bg-green-50 border border-green-200 rounded-md p-3 text-center">
              {resendSuccess}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification Code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              required
              value={otpValue}
              onChange={handleOtpChange}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="underline underline-offset-4 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Resend"
                )}
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={isSubmitting || otpValue.length !== 6}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
          </Field>
          <FieldDescription className="text-center">
            <a href="/login" className="underline underline-offset-4">
              Back to login
            </a>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
