import api from "@/lib/axios";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  signUp: async (username: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },
};
