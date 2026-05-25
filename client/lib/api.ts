import axios from "axios";

// Helper to get cookie by name
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};

export const customerApi = {
  getCustomers: async () => {
    const response = await api.get("/api/customers");
    return response.data;
  },
  createCustomer: async (data: any) => {
    const response = await api.post("/api/customers", data);
    return response.data;
  },
  updateCustomer: async (data: any) => {
    const response = await api.patch(`/api/customers/${data.id}`, data);
    return response.data;
  },
  deleteCustomer: async (id: number) => {
    const response = await api.delete(`/api/customers/${id}`);
    return response.data;
  }
};

export const jobsApi = {
  getJobs: async (status?: string) => {
    const response = await api.get("/api/jobs", { params: { status } });
    return response.data;
  },
  createJob: async (data: any) => {
    const response = await api.post("/api/jobs", data);
    return response.data;
  },
  updateJob: async (data: any) => {
    const response = await api.patch(`/api/jobs/${data.id}`, data);
    return response.data;
  },
  deleteJob: async (id: number) => {
    const response = await api.delete(`/api/jobs/${id}`);
    return response.data;
  },
};

export const dashboardApi = {
  getSummary: async () => {
    const response = await api.get("/api/dashboard/summary");
    return response.data;
  },
  getRecentJobs: async () => {
    const response = await api.get("/api/dashboard/recent-jobs");
    return response.data;
  },
  getUpcomingReminders: async () => {
    const response = await api.get("/api/dashboard/upcoming-reminders");
    return response.data;
  },
};

export const reminderApi = {
  getReminders: async (status?: string) => {
    const response = await api.get("/api/reminders", { params: { status } });
    return response.data;
  },
  createReminder: async (data: any) => {
    const response = await api.post("/api/reminders", data);
    return response.data;
  },
  updateReminder: async ({ id, data }: { id: number; data: any }) => {
    const response = await api.patch(`/api/reminders/${id}`, data);
    return response.data;
  },
  deleteReminder: async (id: number) => {
    const response = await api.delete(`/api/reminders/${id}`);
    return response.data;
  },
};

export default api;
