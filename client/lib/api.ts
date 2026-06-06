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

api.interceptors.response.use(
  // If the response is successful, just return it.
  (response) => {
    return response;
  },
  // If we get a 401 response, it means the token is invalid or expired. We can clear the token and redirect to login.
    (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // FIX: Check against an array of public paths
      const currentPath = window.location.pathname;
      const publicPaths = ["/", "/login", "/signup"];
      
      // Only redirect if they are trying to access a private dashboard page
      if (!publicPaths.includes(currentPath)) {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
)


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
  getCustomerById: async (id: number) => {
    const response = await api.get(`/api/customers/${id}`);
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
  getJobById: async (id: number) => {
    const response = await api.get(`/api/jobs/${id}`);
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

export const userApi = {
  getProfile: async () => {

    const response = await api.get("/api/me");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch("/api/profile", data);
    return response.data;
  },
  updatePassword: async (data: any) => {
    const response = await api.patch("/api/password", data);
    return response.data;
  },
};

export default api;
