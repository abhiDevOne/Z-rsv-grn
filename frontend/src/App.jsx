import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { Loader } from "lucide-react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import StudentDashboard from "./pages/StudentDashboard";
import GrievanceForm from "./pages/GrievanceForm";
import Layout from "./components/Layout";
import OfficerDashboard from "./pages/OfficerDashboard";
import SingleGrievance from "./pages/SingleGrievance";
import PublicFeed from "./pages/PublicFeed";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Check session on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking auth
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 antialiased dark:bg-gray-900 min-h-screen">
      <Routes>
        {/* PUBLIC ROUTE: Landing Page 
            Logic: If user is logged in, auto-redirect to /dashboard. 
            If not, show Landing Page.
        */}
        <Route
          path="/"
          element={!authUser ? <LandingPage /> : <Navigate to="/dashboard" />}
        />

        {/* AUTH ROUTES: Redirect to /dashboard if already logged in */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/dashboard" />}
        />

        {/* PROTECTED ROUTE: Main Dashboard (Moved to /dashboard) */}
        <Route
          path="/dashboard"
          element={
            authUser ? (
              <Layout>
                {authUser.role === "student" ? (
                  <StudentDashboard />
                ) : (
                  <OfficerDashboard />
                )}
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* OTHER PROTECTED ROUTES */}
        <Route
          path="/submit-grievance"
          element={
            authUser ? (
              <Layout>
                <GrievanceForm />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/grievance/:id"
          element={
            authUser ? (
              <Layout>
                <SingleGrievance />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/feed"
          element={
            authUser ? (
              <Layout>
                <PublicFeed />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Placeholder for Profile Page */}
        <Route
          path="/profile"
          element={
            authUser ? (
              <Layout>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
