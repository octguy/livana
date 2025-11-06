import { BrowserRouter, Route, Routes } from "react-router";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
