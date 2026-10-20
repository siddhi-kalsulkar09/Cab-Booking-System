import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (storedAdmin) {
      setUser({ ...JSON.parse(storedAdmin), role: "admin" });
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role || "user");
    setUser(data.user);
  };

  const adminLogin = (data) => {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));
    localStorage.setItem("role", "admin");
    setUser({ ...data.admin, role: "admin" });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);