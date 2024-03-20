import style from "@/components/navbar/navbar.module.css"
import Link from "next/link"
import Image from "next/image"
// 加入自訂 hook - useAuth 方便全局狀態管理與應用
import { useAuth } from "@/components/auth/useAuth"
export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  // 為了 JSX 版面整潔，將 auth 條件渲染提取到變數中
  const authLink = isAuthenticated ? (
    <button className={style["auth-logout"]} onClick={logout}>
      登出
    </button>
  ) : (
    <Link className={style["auth-a"]} href="/signIn">
      登入
    </Link>
  )

  let currentUserInLS
  let currentUserId
  if (isAuthenticated) {
    currentUserInLS = localStorage.getItem("currentUser")
    if (currentUserInLS) {
      // console.log("currentUserInLS", currentUserInLS);
      console.log("JSON.parse(currentUserInLS)", JSON.parse(currentUserInLS))
      currentUserId = JSON.parse(currentUserInLS).id
    }
  }

  return (
    <>
      <div className={style.wrapper}>
        <div className={style["nav-left"]}>
          <Image
            className={style.logo}
            src="/images/dice2.png"
            width={30}
            height={30}
            alt="logo display a dice"
          />
          <nav className={style.navbar}>
            <Link href="/">十八仔</Link>
            {/*  3洗芭樂 */}
          </nav>
          {/* <h2>isAuthenticated in Navbar:{isAuthenticated.toString()}</h2> */}
        </div>

        <div className={style["nav-mid"]}>
          {/* <Link className={style["nav-mid-link"]} href="/about">
            關於我們
          </Link> */}
          <Link
            className={style["nav-mid-link"]}
            href={`/users/${currentUserId}`}
          >
            使用者資訊
          </Link>
          {/* 最新動態 練習用  嘗試動態nextjs的渲染 可以用骰骰子紀錄來暫時做測試用 之後要拿掉 */}
          <Link className={style["nav-mid-link"]} href="/feeds">
            最新動態
          </Link>
        </div>

        {/* 如果包含特殊字符 例如`-`  要用[]來訪問 */}
        <div className={style["nav-right"]}>
          <nav className={style.auth}>
            {/* 使用 css module 或　react 時，不能直接使用複合選擇器 例如 .auth a
            這是無法使用的 
            有兩種方式可以處理:
            1. 重新定另一個名稱
            2. global css
            */}
            {authLink}

            <Link className={style["auth-a"]} href="/signUp">
              註冊
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
