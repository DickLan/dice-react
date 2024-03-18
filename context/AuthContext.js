// react 內建 context api 可以用來管理全域狀態
// 類似 PINIA
// 這裡要創建並使用一個名為 AuthContext 的 context
import React, { createContext, useState, useContext,useEffect, useRef } from "react";
import { apiHelper } from "@/utils/helpers";
const AuthContext = createContext(); // 創建 context 對象

// 定義 provider 元件
// 用於將 AuthContext 的值傳給子元件
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({name: "empty", id: -1});

  // 登入與登出的方法
 const login = (user) => {
  setIsAuthenticated(true)
  localStorage.setItem('currentUser', user)
  
 }
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
  };




  useEffect(() => {
    // useEffect 不能直接改成 async 函數
    // 所以要像下面這樣寫
    
  const fetchData = async () => {
    const response = await apiHelper.get("/fetchCurrentUser");
    if (response.data) {
    setCurrentUser(response.data);
    setIsAuthenticated(true);
  } else {
    setIsAuthenticated(false);
  }
    // console.log("response.data:", response.data); 
  };
  if (isAuthenticated){
    fetchData();
  }
  // 在 useEffect 裏面看到的數據，仍是初始值
    // console.log("pre currentUser",currentUser)
    // fetchData()
    // console.log("after fetch currentUser",currentUser)
    
  }, [isAuthenticated]); 

  // 在元件的主體中才會看到更新
  console.log("currentUser in component body:", currentUser);



  return (
    // 將狀態與方法傳給子元件 這樣子元件就可以透過 AuthContext 來使用這些傳遞的狀態與方法
    <AuthContext.Provider value={{ isAuthenticated, login, logout,currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 定義一個自訂的 Hook，讓元件可以方便訪問 AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
