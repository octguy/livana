# Frontend Role-Based Implementation Guide

## Backend Changes

The `AuthResponse` now includes a `roles` field that returns a list of role names for the authenticated user.

### Response Structure

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "id": "uuid-here",
    "username": "john_doe",
    "email": "john@example.com",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "roles": ["ROLE_USER", "ROLE_ADMIN"]
  },
  "error": null
}
```

## Frontend Implementation

### 1. Store Role Information After Login

```javascript
// After successful login/register
const handleLogin = async (credentials) => {
  try {
    const response = await axios.post("/api/v1/auth/login", credentials);
    const { data } = response.data;

    // Store tokens
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Store user info including roles
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
      })
    );

    // Redirect based on role
    if (data.roles.includes("ROLE_ADMIN")) {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### 2. Create Role Checking Utility

```javascript
// utils/auth.js
export const getUserRoles = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.roles || [];
};

export const hasRole = (role) => {
  const roles = getUserRoles();
  return roles.includes(role);
};

export const isAdmin = () => hasRole("ROLE_ADMIN");
export const isUser = () => hasRole("ROLE_USER");
export const isModerator = () => hasRole("ROLE_MODERATOR");
```

### 3. Protected Routes (React Example)

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { hasRole } from "../utils/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 4. Route Configuration

```javascript
// App.jsx or routes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* User routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5. Conditional UI Rendering

```javascript
// Example component
import { isAdmin, hasRole } from "../utils/auth";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Show admin panel only for admins */}
      {isAdmin() && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View Reports</button>
        </div>
      )}

      {/* Show moderator features */}
      {hasRole("ROLE_MODERATOR") && (
        <div className="moderator-panel">
          <h2>Moderator Tools</h2>
          <button>Review Content</button>
        </div>
      )}

      {/* Regular user content */}
      <div className="user-content">
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
};
```

### 6. Navigation Menu Based on Role

```javascript
// components/Sidebar.jsx
import { isAdmin, isModerator } from "../utils/auth";

const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>

        {(isAdmin() || isModerator()) && (
          <>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
          </>
        )}

        {isAdmin() && (
          <>
            <li>
              <Link to="/admin/users">User Management</Link>
            </li>
            <li>
              <Link to="/admin/settings">System Settings</Link>
            </li>
            <li>
              <Link to="/admin/property-types">Property Types</Link>
            </li>
            <li>
              <Link to="/admin/amenities">Amenities</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
```

### 7. Handle Token Refresh

```javascript
// utils/axiosInterceptor.js
import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/v1/auth/refresh", {
          refreshToken,
        });
        const { data } = response.data;

        // Update stored data including roles
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles,
          })
        );

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Available Roles

- `ROLE_USER` - Regular users
- `ROLE_ADMIN` - Administrators (full access)
- `ROLE_MODERATOR` - Moderators (limited admin access)

## Security Notes

1. **Always validate roles on the backend** - Frontend checks are for UX only
2. **Store tokens securely** - Consider using httpOnly cookies for production
3. **Clear all storage on logout**:
   ```javascript
   const logout = () => {
     localStorage.clear();
     navigate("/login");
   };
   ```
4. **Refresh user data after token refresh** to ensure roles are up-to-date

## Advanced Examples

### 8. Context Provider for Authentication (Recommended)

```javascript
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/v1/auth/login", credentials);
      const { data } = response.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles,
        })
      );

      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const isAdmin = () => hasRole("ROLE_ADMIN");
  const isUser = () => hasRole("ROLE_USER");
  const isModerator = () => hasRole("ROLE_MODERATOR");

  const value = {
    user,
    login,
    logout,
    hasRole,
    isAdmin,
    isUser,
    isModerator,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### 9. Using Auth Context in Components

```javascript
// App.jsx
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{/* ... routes */}</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

```javascript
// components/Login.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);

      // Redirect based on role
      if (data.roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
```

### 10. Protected Route with Context

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 11. Multiple Roles Support

```javascript
// components/MultiRoleProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MultiRoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.some((role) =>
    user.roles?.includes(role)
  );

  if (allowedRoles.length > 0 && !hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default MultiRoleProtectedRoute;
```

```javascript
// Usage in routes
<Route
  path="/reports/*"
  element={
    <MultiRoleProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_MODERATOR"]}>
      <ReportsLayout />
    </MultiRoleProtectedRoute>
  }
/>
```

### 12. Role-Based Component

```javascript
// components/RoleBasedComponent.jsx
import { useAuth } from "../contexts/AuthContext";

const RoleBasedComponent = ({ roles = [], children, fallback = null }) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const hasRequiredRole =
    roles.length === 0 || roles.some((role) => user.roles?.includes(role));

  return hasRequiredRole ? children : fallback;
};

export default RoleBasedComponent;
```

```javascript
// Usage
import RoleBasedComponent from "./components/RoleBasedComponent";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>

      <RoleBasedComponent roles={["ROLE_ADMIN"]}>
        <AdminPanel />
      </RoleBasedComponent>

      <RoleBasedComponent
        roles={["ROLE_ADMIN", "ROLE_MODERATOR"]}
        fallback={<p>You don't have access to this feature</p>}
      >
        <ModeratorTools />
      </RoleBasedComponent>
    </div>
  );
};
```

### 13. Axios Setup with Role Management

```javascript
// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1",
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { data } = response.data;

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles,
          })
        );

        // Dispatch event to update context
        window.dispatchEvent(new Event("token-refreshed"));

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 14. Admin-Only API Calls

```javascript
// services/adminService.js
import api from "./api";

export const adminService = {
  // Property Types
  getAllPropertyTypes: () => api.get("/property-types"),
  createPropertyType: (data) => api.post("/property-types", data),
  updatePropertyType: (id, data) => api.put(`/property-types/${id}`, data),
  softDeletePropertyType: (id) => api.delete(`/property-types/${id}/soft`),
  hardDeletePropertyType: (id) => api.delete(`/property-types/${id}/hard`),
  softDeleteAllPropertyTypes: () => api.delete("/property-types/soft/all"),
  hardDeleteAllPropertyTypes: () => api.delete("/property-types/hard/all"),

  // Amenities
  getAllAmenities: () => api.get("/amenities"),
  createAmenity: (data) => api.post("/amenities", data),
  updateAmenity: (id, data) => api.put(`/amenities/${id}`, data),
  softDeleteAmenity: (id) => api.delete(`/amenities/${id}/soft`),
  hardDeleteAmenity: (id) => api.delete(`/amenities/${id}/hard`),
  softDeleteAllAmenities: () => api.delete("/amenities/soft/all"),
  hardDeleteAllAmenities: () => api.delete("/amenities/hard/all"),

  // Facilities
  getAllFacilities: () => api.get("/facilities"),
  createFacility: (data) => api.post("/facilities", data),
  updateFacility: (id, data) => api.put(`/facilities/${id}`, data),
  softDeleteFacility: (id) => api.delete(`/facilities/${id}/soft`),
  hardDeleteFacility: (id) => api.delete(`/facilities/${id}/hard`),
  softDeleteAllFacilities: () => api.delete("/facilities/soft/all"),
  hardDeleteAllFacilities: () => api.delete("/facilities/hard/all"),

  // Experience Categories
  getAllExperienceCategories: () => api.get("/experience-categories"),
  createExperienceCategory: (data) => api.post("/experience-categories", data),
  updateExperienceCategory: (id, data) =>
    api.put(`/experience-categories/${id}`, data),
  softDeleteExperienceCategory: (id) =>
    api.delete(`/experience-categories/${id}/soft`),
  hardDeleteExperienceCategory: (id) =>
    api.delete(`/experience-categories/${id}/hard`),
  softDeleteAllExperienceCategories: () =>
    api.delete("/experience-categories/soft/all"),
  hardDeleteAllExperienceCategories: () =>
    api.delete("/experience-categories/hard/all"),

  // User Management
  getAllUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, roles) => api.put(`/users/${id}/roles`, { roles }),
};
```

### 15. Admin Panel Example

```javascript
// pages/admin/PropertyTypesManagement.jsx
import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";

const PropertyTypesManagement = () => {
  const { isAdmin } = useAuth();
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAdmin()) {
      fetchPropertyTypes();
    }
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const response = await adminService.getAllPropertyTypes();
      setPropertyTypes(response.data.data);
    } catch (error) {
      console.error("Failed to fetch property types", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updatePropertyType(editingId, formData);
      } else {
        await adminService.createPropertyType(formData);
      }
      setFormData({ name: "", icon: "" });
      setEditingId(null);
      fetchPropertyTypes();
    } catch (error) {
      console.error("Failed to save property type", error);
    }
  };

  const handleEdit = (propertyType) => {
    setFormData({ name: propertyType.name, icon: propertyType.icon });
    setEditingId(propertyType.id);
  };

  const handleSoftDelete = async (id) => {
    if (confirm("Are you sure you want to soft delete this property type?")) {
      try {
        await adminService.softDeletePropertyType(id);
        fetchPropertyTypes();
      } catch (error) {
        console.error("Failed to soft delete", error);
      }
    }
  };

  const handleHardDelete = async (id) => {
    if (
      confirm("Are you sure you want to PERMANENTLY delete this property type?")
    ) {
      try {
        await adminService.hardDeletePropertyType(id);
        fetchPropertyTypes();
      } catch (error) {
        console.error("Failed to hard delete", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="property-types-management">
      <h2>Property Types Management</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          maxLength={15}
        />
        <input
          type="text"
          placeholder="Icon (emoji)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          required
          maxLength={1}
        />
        <button type="submit">
          {editingId ? "Update" : "Create"} Property Type
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", icon: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {propertyTypes.map((type) => (
            <tr key={type.id}>
              <td>{type.icon}</td>
              <td>{type.name}</td>
              <td>{type.id}</td>
              <td>
                <button onClick={() => handleEdit(type)}>Edit</button>
                <button onClick={() => handleSoftDelete(type.id)}>
                  Soft Delete
                </button>
                <button
                  onClick={() => handleHardDelete(type.id)}
                  className="danger"
                >
                  Hard Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTypesManagement;
```

### 16. TypeScript Types (Optional)

```typescript
// types/auth.types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  USER = "ROLE_USER",
  MODERATOR = "ROLE_MODERATOR",
}
```

```typescript
// contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginCredentials, AuthResponse } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isModerator: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ... rest of implementation
```

## Testing Examples

### 17. Testing Role-Based Components

```javascript
// __tests__/ProtectedRoute.test.jsx
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/AuthContext";

const MockComponent = () => <div>Protected Content</div>;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redirects to login when not authenticated", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <MockComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("renders content when authenticated with correct role", () => {
    localStorage.setItem("accessToken", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "1",
        username: "admin",
        email: "admin@test.com",
        roles: ["ROLE_ADMIN"],
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <MockComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects when user lacks required role", () => {
    localStorage.setItem("accessToken", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "1",
        username: "user",
        email: "user@test.com",
        roles: ["ROLE_USER"],
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <MockComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
```

## Summary

This implementation provides:

1. ✅ **Secure authentication** with role-based access control
2. ✅ **Token management** with automatic refresh
3. ✅ **Protected routes** for both single and multiple roles
4. ✅ **Context-based state management** for easy access throughout the app
5. ✅ **Conditional rendering** based on user roles
6. ✅ **Admin panel examples** for managing entities
7. ✅ **TypeScript support** for type safety (optional)
8. ✅ **Testing examples** for role-based components

Remember: **Always validate permissions on the backend**. Frontend role checks are only for user experience and should never be relied upon for security.
