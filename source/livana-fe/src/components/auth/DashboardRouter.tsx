import { useAuthStore } from "@/stores/useAuthStore";
import UserDashboardPage from "@/pages/dashboard/UserDashboardPage";
import AdminDashboardPage from "@/pages/dashboard/AdminDashboardPage";

export function DashboardRouter() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  // Debug logging
  // console.log("DashboardRouter - User:", user);
  // console.log("DashboardRouter - Roles:", user?.roles);
  // console.log("DashboardRouter - Loading:", loading);

  // Wait for user data to load
  if (!user || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading page...
      </div>
    );
  }

  // Check if user has ROLE_ADMIN
  const isAdmin = user.roles?.includes("ROLE_ADMIN");

  // console.log("DashboardRouter - Is Admin:", isAdmin);

  // Route to admin dashboard if user is admin, otherwise user dashboard
  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return <UserDashboardPage />;
}
