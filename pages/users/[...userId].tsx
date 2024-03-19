// 為了測試動態路由而開的畫面
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
export default function UserPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  // 當命名為 [...user]時， router.query就會有 .user這個屬性
  const { userId } = router.query // user 是一個字串或是字串陣列，包含所有路徑參數
  let currentUser
  if (isAuthenticated) {
    const storedUser = localStorage.getItem("currentUser")
    currentUser = storedUser ? JSON.parse(storedUser) : null
  }

  return (
    <>
      <h1>User Page</h1>
      <h2>測試動態路由</h2>
      <h3>顯示不同使用者的會員資訊</h3>
      <h4>測試功能而已，後續會移除</h4>

      <p>User ID: {Array.isArray(userId) ? userId.join("/") : userId}</p>
      <p>User Name: {currentUser?.name}</p>
      <p>User Mail: {currentUser?.email}</p>
      <p>User Gender:{currentUser?.gender === 2 ? "Male" : "Female"}</p>
    </>
  )
}
