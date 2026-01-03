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
import { Loader2 } from "lucide-react";

const forgotPasswordRequestSchema = z.object({
  email: z.email("Invalid email"),
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
        setForgotPasswordError("Email does not exist in the system.");
      } else if (status === 500) {
        setForgotPasswordError("Server error. Please try again later.");
      } else if (error?.response?.data?.message) {
        setForgotPasswordError(String(error.response.data.message));
      } else {
        setForgotPasswordError("Request failed. Please try again.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to recover your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {forgotPasswordError && (
                <div className="text-destructive text-sm font-semibold bg-destructive/10 border border-destructive/20 rounded-md p-3">
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
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </Button>
              </Field>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up now
                </a>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
