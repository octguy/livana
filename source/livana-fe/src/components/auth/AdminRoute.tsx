import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const AdminRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();

  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      console.log("No access token, attempting to refresh...");
      await refresh();
    }

    if (accessToken && !user) {
      console.log("Access token present but no user, fetching user info...");
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
