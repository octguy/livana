import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import React, { useState } from "react";
import { PASSWORD_REGEX } from "@/constant/regex";
import { Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(
      PASSWORD_REGEX,
      "Mật khẩu phải có ít nhất một số, 1 chữ hoa, 1 chữ cái đặc biệt"
    ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();

  // Add local state to show login error above the username field
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Form Data:", data);

    const { username, password } = data;

    try {
      setLoginError(null);
      const response = await login(username, password);
      console.log("Login response:", response.message);

      // Check if user is admin and redirect accordingly
      const isAdmin = response.data.roles?.includes("ROLE_ADMIN");
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Prefer friendly message for 401, otherwise server message or generic
      const status = error?.response?.status ?? error?.status;
      if (status === 401 || status === 404) {
        setLoginError("Thông tin đăng nhập sai");
      } else if (status === 500) {
        setLoginError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else if (error?.response?.data?.message) {
        setLoginError(String(error.response.data.message));
      } else {
        setLoginError("Đăng nhập không thành công. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/public/vite.svg" alt="logo" />
                </a>

                <h1 className="text-2xl font-bold">Đăng nhập Livana</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
                </p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                {/* Show login error above the username label */}
                {loginError && (
                  <p className="text-destructive text-sm font-semibold bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    {loginError}
                  </p>
                )}

                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="livana"
                  {...register("username")}
                  onChange={(e) => {
                    register("username").onChange(e);
                    clearErrors("username");
                    setLoginError(null); // also clear login error
                  }}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm">
                    Mật khẩu
                  </Label>
                  <a
                    href="/forgot-password"
                    className="text-sm hover:text-primary"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="pr-10"
                    {...register("password")}
                    onChange={(e) => {
                      register("password").onChange(e);
                      clearErrors("password");
                      setLoginError(null);
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
                  Mật khẩu phải có ít nhất một số, 1 chữ hoa, 1 chữ cái đặc biệt
                </p>
              </div>

              {/* nút đăng ký */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Hình ảnh"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
