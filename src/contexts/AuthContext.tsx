"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token =
      localStorage.getItem("accessToken") || Cookies.get("accessToken");
    console.log("AuthContext - Checking auth, token exists:", !!token);
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    return isAuth;
  };

  useEffect(() => {
    console.log("AuthContext - Initial auth check");
    checkAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    console.log("AuthContext - Login called with token:", !!accessToken);

    // Store in both localStorage and cookies
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Set cookies with proper options
    Cookies.set("accessToken", accessToken, {
      expires: 7,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setIsAuthenticated(true);
    console.log("AuthContext - Login complete, redirecting to home");
    window.location.href = "/";
  };

  const logout = () => {
    console.log("AuthContext - Logout called");
    // Clear from both localStorage and cookies
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
