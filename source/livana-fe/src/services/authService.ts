import api from "@/lib/axios";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post(
      "/auth/login",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  signUp: async (username: string, email: string, password: string) => {
    const response = await api.post(
      "/auth/register",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  logOut: async () => {
    const response = await api.post("/auth/logout", {
      withCredentials: true,
    });
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get("/users/me", {
      withCredentials: true,
    });
    return response.data;
  },
};
