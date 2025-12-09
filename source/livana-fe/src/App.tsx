import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import { Toaster } from "sonner";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { ProfilePage } from "./pages/setting/ProfilePage";
import { CreateHomePage } from "@/pages/host/CreateHomePage";
import { CreateExperiencePage } from "@/pages/host/CreateExperiencePage";
import { HomeLocationPage } from "@/pages/host/HomeLocationPage";
import { HomeDetailsPage } from "@/pages/host/HomeDetailsPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/host/homes/create" element={<CreateHomePage />} />
            <Route path="/host/homes/location" element={<HomeLocationPage />} />
            <Route path="/host/homes/details" element={<HomeDetailsPage />} />
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
