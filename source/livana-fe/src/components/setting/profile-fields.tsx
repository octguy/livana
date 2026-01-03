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
import type { UpdateProfileRequest } from "@/types/request/updateProfileRequest";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number can only contain digits"),
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
      const updatedData: UpdateProfileRequest = {
        fullName,
        phoneNumber: data.phone,
        bio: data.bio,
      };
      console.log("Updating profile with data:", updatedData);
      await update(updatedData);
      await useAuthStore.getState().fetchMe();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ProfileField
            icon={User}
            label="First Name"
            placeholder="John"
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
            label="Last Name"
            placeholder="Doe"
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
            label="Phone Number"
            type="tel"
            placeholder="1234567890"
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
          <label className="text-sm font-medium">Bio</label>
        </div>
        <Textarea
          placeholder="Tell us about yourself..."
          className="w-full min-h-[100px]"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Update profile
      </Button>
    </form>
  );
}
