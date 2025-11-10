import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  // console.log("Dashboard user:", user?.username);

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
    <div>
      <Logout />
      <Button onClick={handleTest} />
      {user?.username && <h1>Welcome, {user.username}!</h1>}
    </div>
  );
};

export default DashboardPage;
