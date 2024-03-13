// react 內建 context api 可以用來管理全域狀態
// 類似 PINIA
// 這裡要創建並使用一個名為 AuthContext 的 context
import React, { createContext, useState, useContext } from "react";
const AuthContext = createContext(); // 創建 context 對象

// 定義 provider 元件
// 用於將 AuthContext 的值傳給子元件
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 登入與登出的方法
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    // 將狀態與方法傳給子元件 這樣子元件就可以透過 AuthContext 來使用這些傳遞的狀態與方法
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 定義一個自訂的 Hook，讓元件可以方便訪問 AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
