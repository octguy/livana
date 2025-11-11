import { User, Phone } from "lucide-react";
import { ProfileField } from "./profile-field";
import { Textarea } from "@/components/ui/textarea";

export function ProfileFields() {
  return (
    <div className="space-y-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField icon={User} label="Họ" placeholder="Nguyễn" />
        <ProfileField icon={User} label="Tên" placeholder="Văn A" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField
          icon={Phone}
          label="Số điện thoại"
          type="tel"
          placeholder="0123456789"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <label className="text-sm font-medium">Tiểu sử</label>
        </div>
        <Textarea
          placeholder="Giới thiệu về bản thân..."
          className="w-full min-h-[100px]"
        />
      </div>
    </div>
  );
}
