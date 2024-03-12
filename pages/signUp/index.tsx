export default function SignUp() {
  return (
    <>
      {/* <SpinnerComponent v-if="isProcessing" /> */}
      <div className="container">
        <div className="form-page-title">
          <h1>註冊</h1>
        </div>

        {/* @submit.stop.prevent="handleSubmit" */}
        <form className="form-control" action="">
          <div className="sign-up-info ">
            {/* <div className="">
          <label for="name">姓名</label>
          <input v-model="formData.name" name="name" id="name" type="text" placeholder="請輸入姓名">
        </div>

        <div v-if="false" className="">
          <label for="account">帳號</label>
          <input v-model="formData.account" name="account" id="account" type="text" placeholder="請輸入帳號">
        </div>

        <div className="">
          <label for="email">信箱</label>
          <input v-model="formData.email" name="email" id="email" type="email" placeholder="請輸入信箱">
        </div>

        <div className="">
          <label for="password">密碼</label>
          <input v-model="formData.password" name="password" id="password" type="password" placeholder="請輸入密碼">
        </div>

        <div className="">
          <label for="confrimPassword">確認密碼</label>
          <input v-model="formData.confrimPassword" name="confrimPassword" id="confrimPassword" type="password"
            placeholder="請再次輸入密碼">
        </div>

        <div className="">
          <label for="gender">性別</label>
          <select v-model="formData.gender" name="gender" id="gender">
            <option value="" disabled selected hidden>請選擇</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>

        </div> */}
          </div>
          <button type="submit">註冊</button>
        </form>
      </div>
    </>
  );
}
