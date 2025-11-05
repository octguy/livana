import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api/v1"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
