import { useState } from "react";
import { auth } from "../api/client.js";
import { AuthContext } from "./AuthContext.jsx";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = async (username, password) => {
    const data = await auth.login(username, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    return data;
  };

  const register = async (username, password) => {
    const data = await auth.register(username, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
