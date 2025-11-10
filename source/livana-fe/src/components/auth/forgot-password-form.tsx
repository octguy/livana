import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

const forgotPasswordRequestSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

type ForgotPasswordRequestValues = z.infer<typeof forgotPasswordRequestSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotPassword } = useAuthStore();
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequestValues>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordRequestValues) => {
    const { email } = data;
    console.log("Forgot password email:", email);

    try {
      await forgotPassword(email);
      console.log("Forgot password request successful for email:", email);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Prefer friendly message for 401, otherwise server message or generic
      const status = error?.response?.status ?? error?.status;
      if (status === 401 || status === 404) {
        setForgotPasswordError("Email không tồn tại trong hệ thống.");
      } else if (status === 500) {
        setForgotPasswordError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else if (error?.response?.data?.message) {
        setForgotPasswordError(String(error.response.data.message));
      } else {
        setForgotPasswordError("Đăng nhập không thành công. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email của bạn để khôi phục mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {forgotPasswordError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {forgotPasswordError}
                </div>
              )}
              {/* email */}
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor="email" className="block text-sm">
                  Email
                </FieldLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="m@gmail.com"
                  {...register("email")}
                  onChange={(e) => {
                    register("email").onChange(e);
                    clearErrors("email");
                  }}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Khôi phục mật khẩu"}
                </Button>
              </Field>
              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a
                  href="/sign-up"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Đăng ký ngay
                </a>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
