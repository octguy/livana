import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
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
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
