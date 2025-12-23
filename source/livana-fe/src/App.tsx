import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import { Toaster } from "sonner";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import { ProtectedRoute, DashboardRouter } from "@/components/auth";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { ProfilePage } from "./pages/setting/ProfilePage";
import { CreateHomePage } from "@/pages/host/CreateHomePage";
import { CreateExperiencePage } from "@/pages/host/CreateExperiencePage";
import { HomeLocationPage } from "@/pages/host/HomeLocationPage";
import { HomeDetailsPage } from "@/pages/host/HomeDetailsPage";
import { HomePhotosPage } from "@/pages/host/HomePhotosPage";
import { HomeTitlePage } from "@/pages/host/HomeTitlePage";
import { HomeDescriptionPage } from "@/pages/host/HomeDescriptionPage";
import { HomePricePage } from "@/pages/host/HomePricePage";
import { HomeReviewPage } from "@/pages/host/HomeReviewPage";
import { HomePage } from "@/pages/HomePage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { HostListingsPage } from "@/pages/HostListingsPage";
import { MyListingsPage } from "@/pages/MyListingsPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/host/:hostId/listings" element={<HostListingsPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
