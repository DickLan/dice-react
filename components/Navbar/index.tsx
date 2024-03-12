import Link from "next/link";
export default function Navbar() {
  return (
    <>
      <div className="wrapper">
        <div className="nav-left">
          {/* <img className="logo" src="@/assets/images/dice2.png" alt="" /> */}
          <nav className="navbar">
            <Link href="/">十八仔 3洗芭樂</Link>
            {/* <!-- <Link href="/about">About</Link> --> */}
          </nav>
        </div>

        <div className="nav-right">
          <nav className="auth">
            <Link v-if="!authStore.isAuthenticated" href="/signIn">
              登入
            </Link>
            {/* <button v-else @click="authStore.clearToken">登出</button> */}
            <Link href="/signUp">註冊</Link>
          </nav>
        </div>
      </div>
    </>
  );
}
