import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useGrievanceStore = create((set, get) => ({
  grievances: [],
  selectedGrievance: null,
  isLoading: false,

  // Submit a new grievance
  createGrievance: async (formData, navigate) => {
    set({ isLoading: true });
    try {
      // Send formData directly. Axios detects it and sets the correct headers.
      const res = await axiosInstance.post("/grievances", formData);
      set((state) => ({ grievances: [res.data, ...state.grievances] }));
      toast.success("✅ Grievance submitted successfully!!");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to submit grievance."
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch my grievances
  getMyGrievances: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/grievances/my-grievances");
      set({ grievances: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to fetch grievances."
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch ALL grievances (For Admin/Officer)
  getAllGrievances: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/grievances");
      set({ grievances: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to fetch grievances."
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // Get Single Grievance
  getGrievanceById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/grievances/${id}`);
      set({ selectedGrievance: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to fetch details."
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // Add Comment
  addComment: async (id, text) => {
    try {
      const res = await axiosInstance.post(`/grievances/${id}/comment`, {
        text,
      });
      // Update the local state immediately
      set((state) => ({
        selectedGrievance: {
          ...state.selectedGrievance,
          comments: res.data,
        },
      }));
      toast.success("🟢 Comment added.");
    } catch (error) {
      toast.error("🔴 Failed to add comment.");
    }
  },

  // Update Status (Officer)
  updateStatus: async (id, status, internalNotes) => {
    try {
      const res = await axiosInstance.put(`/grievances/${id}/status`, {
        status,
        internalNotes,
      });

      // Update local state
      set((state) => ({
        selectedGrievance: {
          ...state.selectedGrievance,
          status: res.data.status,
          internalNotes: res.data.internalNotes,
        },
      }));
      toast.success("✅ Status updated.");
    } catch (error) {
      toast.error("❌ Failed to update status.");
    }
  },

  // Upvote a grievance
  upvoteGrievance: async (id) => {
    try {
      const res = await axiosInstance.put(`/grievances/${id}/upvote`);

      // Optimistic UI Update: Update the local state immediately
      set((state) => ({
        grievances: state.grievances.map((g) =>
          g._id === id ? { ...g, upvotes: res.data } : g
        ),
      }));
      // Also update selectedGrievance if we are currently viewing it..
      const selected = get().selectedGrievance;
      if (selected && selected._id === id) {
        set({ selectedGrievance: { ...selected, upvotes: res.data } });
      }
    } catch (error) {
      toast.error("🔴 Failed to vote.");
    }
  },
}));
