import Logout from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  // console.log("Dashboard user:", user?.username);
  return (
    <div>
      <Logout />
      {user?.username && <h1>Welcome, {user.username}!</h1>}
    </div>
  );
};

export default DashboardPage;
