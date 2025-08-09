import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Type đầy đủ bao gồm token, userName, role
type AuthContextType = {
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, userName: string, role: "Client" | "Staff") => Promise<void>;
  logout: () => Promise<void>;
  userName?: string;
  role?: "Client" | "Staff";
};

// Tạo context mặc định
const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | undefined>();
  const [role, setRole] = useState<"Client" | "Staff" | undefined>();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserName = await AsyncStorage.getItem("userName");
      const storedRole = await AsyncStorage.getItem("role");

      if (storedToken && storedRole) {
        setToken(storedToken);
        setUserName(storedUserName || undefined);
        setRole(storedRole as "Client" | "Staff");
        setIsLoggedIn(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (newToken: string, newUserName: string, newRole: "Client" | "Staff") => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("userName", newUserName);
      await AsyncStorage.setItem("role", newRole);

      setToken(newToken);
      setUserName(newUserName);
      setRole(newRole);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("❌ Error saving token, userName or role:", error);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "userName", "role", "clientId", "staffId"]);
    setToken(null);
    setUserName(undefined);
    setRole(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, loading, login, logout, userName, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
