import Logout from "@/components/auth/logout";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  // console.log("Dashboard user:", user);

  const handleTest = async () => {
    try {
      const response = await api.get("/dummy/hello", { withCredentials: true });
      toast.success("Test API thành công! Kiểm tra console để biết chi tiết.");
      console.log("Test API response:", response.data);
    } catch (error) {
      toast.error(
        "Test API không thành công. Kiểm tra console để biết chi tiết."
      );
      console.error("Test API error:", error);
    }
  };
  return (
    <MainLayout>
      <div className="relative min-h-screen">
        <div className="p-4">
          <Logout />
          <Button onClick={handleTest}>Test API</Button>
          {user?.username && (
            <h1 className="mt-4">Welcome, {user.username}!</h1>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
