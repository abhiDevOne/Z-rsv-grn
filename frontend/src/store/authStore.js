import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true, // <--- Start as TRUE, so we wait before redirecting

  // Function to Register
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("✅ Account created successfully!!");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Function to Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("✅ Logged in successfully!!");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Function to Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("✅ Logged out successfully!!");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Logout failed.");
    }
  },

  // Check Auth on Refresh
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null }); // Token invalid or expired
    } finally {
      set({ isCheckingAuth: false }); // Loading done
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    set({ isLoggingIn: true }); // Reuse loading state or add a new one
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ authUser: res.data });
      toast.success("✅ Profile updated successfully!!");
      return true; // Return success
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Update failed.");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
