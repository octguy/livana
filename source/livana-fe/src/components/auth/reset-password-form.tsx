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
import { PASSWORD_REGEX } from "@/constant/regex";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";

const resetPasswordRequestSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must have at least one number, one uppercase letter, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordRequestValues = z.infer<typeof resetPasswordRequestSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { resetPassword } = useAuthStore();
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequestValues>({
    resolver: zodResolver(resetPasswordRequestSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordRequestValues) => {
    const { password, confirmPassword } = data;
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    const token = searchParams.get("token");
    console.log("Reset token:", token);
    if (token) {
      try {
        await resetPassword(token, password);
        console.log("Password reset successful");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Prefer friendly message for 400, otherwise server message or generic
        const status = error?.response?.status ?? error?.status;
        if (status === 400 || status === 404) {
          setResetPasswordError(
            "Password reset failed. Please check your email."
          );
        } else if (status === 500) {
          setResetPasswordError("Server error. Please try again later.");
        } else if (error?.response?.data?.message) {
          setResetPasswordError(String(error.response.data.message));
        } else {
          setResetPasswordError("Password reset failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {resetPasswordError && (
                <div className="text-destructive text-sm font-semibold bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  {resetPasswordError}
                </div>
              )}
              {/* password */}
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor="password" className="block text-sm">
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="pr-10"
                    {...register("password")}
                    onChange={(e) => {
                      register("password").onChange(e);
                      clearErrors("password");
                      setResetPasswordError(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
                {/* Note about password requirements */}
                <p className="text-xs text-muted-foreground">
                  Password must have at least one number, one uppercase letter,
                  and one special character
                </p>
              </div>
              {/* confirm password */}
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor="confirmPassword" className="block text-sm">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="pr-10"
                    {...register("confirmPassword")}
                    onChange={(e) => {
                      register("confirmPassword").onChange(e);
                      clearErrors("confirmPassword");
                      setResetPasswordError(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </Button>
              </Field>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </a>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
