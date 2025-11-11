import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ProfileAvatar } from "@/components/setting/profile-avatar";
import { ProfileFields } from "@/components/setting/profile-fields";
import { ProfileInterests } from "@/components/setting/profile-interests";
import { useAuthStore } from "@/stores/useAuthStore";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  console.log("ProfilePage user:", user);

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-semibold mb-2">Hồ sơ của tôi</h1>
        <p className="text-muted-foreground">
          Người dùng và chủ nhà có thể xem hồ sơ của bạn để xây dựng lòng tin
          trong cộng đồng.
        </p>

        <ProfileAvatar />
        <ProfileFields />
        <ProfileInterests />

        {/* Action Button */}
        <div className="flex justify-end">
          <Button type="button" size="lg">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
