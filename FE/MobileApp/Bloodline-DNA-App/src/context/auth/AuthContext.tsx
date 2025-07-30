import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Type đầy đủ bao gồm token
type AuthContextType = {
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, userName: string) => Promise<void>;
  logout: () => Promise<void>;
  userName?: string;
};

// Tạo context mặc định
const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setFullName] = useState<string | undefined>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUserName = await AsyncStorage.getItem("userName");
      setFullName(storedUserName || undefined);
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (newToken: string, newFullName: string) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("fullName", newFullName);

      setToken(newToken);
      setIsLoggedIn(true);
      setFullName(newFullName);
    } catch (error) {
      console.error("❌ Error saving token or fullName:", error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userName");
    setIsLoggedIn(false);
    setFullName(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, loading, login, logout, userName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
