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
      setVerifyError("Email không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }

    if (otpValue.length !== 6) {
      setVerifyError("Vui lòng nhập đầy đủ 6 chữ số");
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
        setVerifyError("Mã xác thực không hợp lệ hoặc đã hết hạn");
      } else if (status === 404) {
        setVerifyError("Không tìm thấy yêu cầu xác thực");
      } else if (status === 500) {
        setVerifyError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else if (error?.response?.data?.message) {
        setVerifyError(String(error.response.data.message));
      } else {
        setVerifyError("Xác thực không thành công. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setVerifyError("Email không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }

    try {
      setIsResending(true);
      setVerifyError(null);
      setResendSuccess(null);
      await resendVerificationCode(email);
      setResendSuccess("Mã xác thực mới đã được gửi đến email của bạn");
      setOtpValue("");
      console.log("Resend code functionality is not implemented yet.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      if (status === 429) {
        setVerifyError("Vui lòng đợi trước khi gửi lại mã");
      } else if (status === 500) {
        setVerifyError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else {
        setVerifyError("Không thể gửi lại mã. Vui lòng thử lại.");
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
            <h1 className="text-xl font-bold">Xác thực tài khoản</h1>
            <FieldDescription>
              {email
                ? `Chúng tôi đã gửi mã 6 chữ số đến ${email}`
                : "Vui lòng nhập mã xác thực 6 chữ số"}
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
              Mã xác thực
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
              Không nhận được mã?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="underline underline-offset-4 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi lại"
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
              Xác thực
            </Button>
          </Field>
          <FieldDescription className="text-center">
            <a href="/login" className="underline underline-offset-4">
              Quay lại đăng nhập
            </a>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
