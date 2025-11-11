import {
  GraduationCap,
  Briefcase,
  MapPin,
  Music,
  Lightbulb,
  Globe,
} from "lucide-react";
import { ProfileField } from "./profile-field";

export function ProfileFields() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <ProfileField
        icon={GraduationCap}
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
      />
      <ProfileField
        icon={Briefcase}
        label="Số điện thoại"
        type="tel"
        placeholder="0123456789"
      />
      <ProfileField
        icon={GraduationCap}
        label="Trường học"
        placeholder="Đại học..."
      />
      <ProfileField
        icon={Briefcase}
        label="Công việc"
        placeholder="Software Engineer..."
      />
      <ProfileField
        icon={MapPin}
        label="Nơi tôi muốn đến"
        placeholder="Paris, Tokyo..."
      />
      <ProfileField
        icon={Music}
        label="Bài hát yêu thích"
        placeholder="Tên bài hát..."
      />
      <ProfileField
        icon={Lightbulb}
        label="Sự thật thú vị"
        placeholder="Điều thú vị về bạn..."
      />
      <ProfileField
        icon={Globe}
        label="Ngôn ngữ"
        placeholder="Tiếng Việt, English..."
      />
    </div>
  );
}
