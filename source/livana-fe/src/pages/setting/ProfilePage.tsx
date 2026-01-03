import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ProfileAvatar } from "@/components/setting/profile-avatar";
import { ProfileFields } from "@/components/setting/profile-fields";
import { ProfileInterests } from "@/components/setting/profile-interests";

export function ProfilePage() {
  // const user = useAuthStore((s) => s.user);
  // console.log("ProfilePage user:", user);

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-semibold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Users and hosts can view your profile to build trust in the community.
        </p>

        <ProfileAvatar />
        <ProfileFields />
        <ProfileInterests />

        {/* Action Button */}
        <div className="flex justify-end">
          <Button type="button" size="lg">
            Save changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
