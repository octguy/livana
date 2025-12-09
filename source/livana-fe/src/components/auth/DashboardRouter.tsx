import { useAuthStore } from "@/stores/useAuthStore";
import UserDashboardPage from "@/pages/dashboard/UserDashboardPage";
import AdminDashboardPage from "@/pages/dashboard/AdminDashboardPage";

export function DashboardRouter() {
  const user = useAuthStore((s) => s.user);

  // Debug logging
  console.log("DashboardRouter - User:", user);
  console.log("DashboardRouter - Roles:", user?.roles);

  // Check if user has ROLE_ADMIN
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  console.log("DashboardRouter - Is Admin:", isAdmin);

  // Route to admin dashboard if user is admin, otherwise user dashboard
  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return <UserDashboardPage />;
}
