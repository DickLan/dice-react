import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { Toast } from "../../composables/toast";
import { apiHelper } from "@/utils/helpers";
export default function SingIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleSignIn", e.target);
    try {
      console.log("handleSignIn");
      const response = await apiHelper.post("/signIn", formData);
      if (!response.data) {
        Toast.fire({
          icon: "error",
          title: "登入失敗1",
        });
        return;
      }
      const data = response.data;

      // 登入成功後 將 token 存在 local storage
      localStorage.setToken(data.token);
      // 將 user 存在 狀態管理器中
      // 要再查一下 react 怎麼處理這部分

      // console.log('authStore.token', authStore.token)
      await Toast.fire({
        icon: "success",
        title: "登入成功",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "登入失敗2",
      });
      console.log("error", error);
    }
  };

  // ts 中必須指定參數的型別
  // handleCHange 是在輸入元素觸發，而不是 form tag，所以要用 changeEvent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="container">
        <div className="form-page-title">
          <h1>登入</h1>
        </div>
        {/*  @submit.prevent.stop="handleSignIn" */}
        <form className="form-control" action="">
          <div className="sign-in-info ">
            {/* 這裡要從 vue 轉成　react */}

            <div className="">
              <label htmlFor="email">信箱</label>
              <input
                value={formData.email}
                onChange={handleChange}
                name="email"
                id="email"
                type="text"
                placeholder="請輸入信箱"
              />
            </div>

            <div className="">
              <label htmlFor="password">密碼</label>
              <input
                value={formData.password}
                onChange={handleChange}
                name="password"
                id="password"
                type="password"
                placeholder="請輸入密碼"
              />
            </div>
          </div>
          <button type="submit">登入</button>
        </form>

        <div className="redirect">
          <a href="/signUp">新會員註冊</a>
          <a href="/forgetPassword">忘記密碼</a>
        </div>
      </div>
    </>
  );
}
