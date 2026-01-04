import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import { Toaster } from "sonner";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import { ProtectedRoute, AdminRoute, DashboardRouter } from "@/components/auth";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { ProfilePage } from "./pages/setting/ProfilePage";
import { CreateHomePage } from "@/pages/host/home/CreateHomePage";
import { CreateExperiencePage } from "@/pages/host/experience/CreateExperiencePage";
import { HomeLocationPage } from "@/pages/host/home/HomeLocationPage";
import { HomeDetailsPage } from "@/pages/host/home/HomeDetailsPage";
import { HomePhotosPage } from "@/pages/host/home/HomePhotosPage";
import { HomeTitlePage } from "@/pages/host/home/HomeTitlePage";
import { HomeDescriptionPage } from "@/pages/host/home/HomeDescriptionPage";
import { HomePricePage } from "@/pages/host/home/HomePricePage";
import { HomeReviewPage } from "@/pages/host/home/HomeReviewPage";
import { ExperienceLocationPage } from "@/pages/host/experience/ExperienceLocationPage";
import { ExperienceCapacityPage } from "@/pages/host/experience/ExperienceCapacityPage";
import { ExperiencePhotosPage } from "@/pages/host/experience/ExperiencePhotosPage";
import { ExperienceTitlePage } from "@/pages/host/experience/ExperienceTitlePage";
import { ExperienceDescriptionPage } from "@/pages/host/experience/ExperienceDescriptionPage";
import { ExperiencePricePage } from "@/pages/host/experience/ExperiencePricePage";
import { ExperienceReviewPage } from "@/pages/host/experience/ExperienceReviewPage";
import ExperienceSessionsPage from "@/pages/host/experience/ExperienceSessionsPage";
import { HomePage } from "@/pages/HomePage";
import { ExperiencesPage } from "@/pages/ExperiencesPage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { ExperienceListingDetailPage } from "@/pages/ExperienceListingDetailPage";
import { HostListingsPage } from "@/pages/HostListingsPage";
import { MyListingsPage } from "@/pages/MyListingsPage";
import { MyBookingsPage } from "@/pages/MyBookingsPage";
import { HostBookingsPage } from "@/pages/HostBookingsPage";
import { HostRevenuePage } from "@/pages/HostRevenuePage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PaymentFailedPage from "@/pages/PaymentFailedPage";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

function App() {
  const { accessToken, user, refresh, fetchMe } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // Try to refresh token if no access token exists
      if (!accessToken) {
        try {
          await refresh();
        } catch (error) {
          // Silent fail - user is not logged in
          console.log("No valid session found", error);
        }
      }

      // Fetch user data if we have a token but no user
      if (accessToken && !user) {
        try {
          await fetchMe();
        } catch (error) {
          console.log("Failed to fetch user data", error);
        }
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route
            path="/experience-listings/:id"
            element={<ExperienceListingDetailPage />}
          />
          <Route path="/host/:hostId/listings" element={<HostListingsPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failed" element={<PaymentFailedPage />} />

          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/host-bookings" element={<HostBookingsPage />} />
            <Route path="/host-revenue" element={<HostRevenuePage />} />
            <Route path="/host/homes/create" element={<CreateHomePage />} />
            <Route path="/host/homes/location" element={<HomeLocationPage />} />
            <Route path="/host/homes/details" element={<HomeDetailsPage />} />
            <Route path="/host/homes/photos" element={<HomePhotosPage />} />
            <Route path="/host/homes/title" element={<HomeTitlePage />} />
            <Route
              path="/host/homes/description"
              element={<HomeDescriptionPage />}
            />
            <Route path="/host/homes/price" element={<HomePricePage />} />
            <Route path="/host/homes/review" element={<HomeReviewPage />} />
            <Route
              path="/host/experiences/create"
              element={<CreateExperiencePage />}
            />
            <Route
              path="/host/experiences/location"
              element={<ExperienceLocationPage />}
            />
            <Route
              path="/host/experiences/capacity"
              element={<ExperienceCapacityPage />}
            />
            <Route
              path="/host/experiences/photos"
              element={<ExperiencePhotosPage />}
            />
            <Route
              path="/host/experiences/title"
              element={<ExperienceTitlePage />}
            />
            <Route
              path="/host/experiences/description"
              element={<ExperienceDescriptionPage />}
            />
            <Route
              path="/host/experiences/price"
              element={<ExperiencePricePage />}
            />
            <Route
              path="/host/experience-listings/sessions"
              element={<ExperienceSessionsPage />}
            />
            <Route
              path="/host/experiences/review"
              element={<ExperienceReviewPage />}
            />
          </Route>

          {/* admin only route */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
