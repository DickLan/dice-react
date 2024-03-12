import React, { FormEvent, useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  // signup form submit
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("formData", formData);
  };

  // 為 event 類型加註 HTMLFormElement，因為有 select 項目
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    // console.log('e.target', e.target);
    // console.log('prev formData', formData);

    const { name, value } = e.target;
    // as HTMLInputElement | HTMLSelectElement;

    // 將當前對象的值設定給 formData 中對應的屬性
    // 做個筆記 這裡得到的狀態 仍是 setFormData 之前的狀態
    // 因為 react 狀態更新是異步操作
    // 若要即時更新狀態，要用 useEffect
    setFormData({ ...formData, [name]: value });
    console.log("next formData", formData);
  };

  return (
    <>
      {/* <SpinnerComponent v-if="isProcessing" /> */}
      <div className="container">
        <div className="form-page-title">
          <h1>註冊</h1>
        </div>

        {/* vue: @submit.stop.prevent="handleSubmit" */}
        <form className="form-control" onSubmit={handleSignUp}>
          <div className="sign-up-info ">
            <div className="">
              {/* htmlFor 要和 Input Id對應 */}
              <label htmlFor="name">姓名</label>
              <input
                value={formData.name}
                onChange={handleChange}
                name="name"
                id="name"
                type="text"
                placeholder="請輸入姓名"
              />
            </div>

            <div v-if="false" className="">
              <label htmlFor="account">帳號</label>
              <input
                value={formData.account}
                onChange={handleChange}
                name="account"
                id="account"
                type="text"
                placeholder="請輸入帳號"
              />
            </div>

            <div className="">
              <label htmlFor="email">信箱</label>
              <input
                value={formData.email}
                onChange={handleChange}
                name="email"
                id="email"
                type="email"
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

            <div className="">
              <label htmlFor="confrimPassword">確認密碼</label>
              <input
                value={formData.confirmPassword}
                onChange={handleChange}
                name="confrimPassword"
                id="confrimPassword"
                type="password"
                placeholder="請再次輸入密碼"
              />
            </div>

            <div className="">
              <label htmlFor="gender">性別</label>
              <select
                value={formData.gender}
                onChange={handleChange}
                name="gender"
                id="gender"
              >
                {/* react 推薦使用 value 來控制選中的選項，而非使用 selected, 因此這裡移除 option 預設的 selected */}
                <option value="" disabled hidden>
                  請選擇
                </option>
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>
          </div>
          <button type="submit">註冊</button>
        </form>
      </div>
    </>
  );
}
