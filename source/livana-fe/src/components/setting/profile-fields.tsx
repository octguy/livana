import { User, Phone } from "lucide-react";
import { ProfileField } from "./profile-field";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";

const profileSchema = z.object({
  firstName: z.string().min(1, "Họ là bắt buộc"),
  lastName: z.string().min(1, "Tên là bắt buộc"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ chứa chữ số"),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileFields() {
  const user = useAuthStore((s) => s.user);
  const { update } = useProfileStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Parse full name if available
      const nameParts = user.fullName?.split(" ") || [];
      const firstName = nameParts.slice(0, -1).join(" ") || "";
      const lastName = nameParts[nameParts.length - 1] || "";

      reset({
        firstName,
        lastName,
        phone: user.phoneNumber || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      const updatedData = {
        fullName,
        phoneNumber: data.phone,
        bio: data.bio,
        avatarUrl: user?.avatarUrl || "",
      };
      console.log("Cập nhật hồ sơ với dữ liệu:", data);
      await update(user!.id, updatedData);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ProfileField
            icon={User}
            label="Họ"
            placeholder="Nguyễn"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <ProfileField
            icon={User}
            label="Tên"
            placeholder="Văn A"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ProfileField
            icon={Phone}
            label="Số điện thoại"
            type="tel"
            placeholder="0123456789"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <label className="text-sm font-medium">Tiểu sử</label>
        </div>
        <Textarea
          placeholder="Giới thiệu về bản thân..."
          className="w-full min-h-[100px]"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Cập nhật hồ sơ
      </Button>
    </form>
  );
}
