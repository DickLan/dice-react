import style from "@/components/Navbar/navbar.module.css";
import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
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
        </div>

        <div className="nav-mid">
          <Link href="/about">關於我們</Link>
          {/* 最新動態 練習用  嘗試動態nextjs的渲染 可以用骰骰子紀錄來暫時做測試用 之後要拿掉 */}
          <Link href="/feeds">最新動態</Link>
        </div>

        {/* 如果包含特殊字符 例如`-`  要用[]來訪問 */}
        <div className={style["nav-right"]}>
          <nav className="auth">
            {/* 使用 css module 或　react 時，不能直接使用複合選擇器 例如 .auth a
            這是無法使用的 
            有兩種方式可以處理:
            1. 重新定另一個名稱
            2. global css
            */}
            <Link
              className={style["auth-a"]}
              v-if="!authStore.isAuthenticated"
              href="/signIn"
            >
              登入
            </Link>
            {/* <button v-else @click="authStore.clearToken">登出</button> */}
            <Link className={style["auth-a"]} href="/signUp">
              註冊
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
