import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);

    try {
      const decoded = jwtDecode(jwtToken);
      setUser({
        nome: decoded.nome || decoded.name || decoded.email || decoded.unique_name,
        email: decoded.email,
        role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        ...decoded
      });
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      login(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


