// 全域 CSS 只能在 _app.js 或 _app.tsx 中引入：這是因為 Next.js 需要確保全域樣式在應用的所有頁面中一致應用，而不會因為頁面切換而重複加載或遺失。
import "@/styles/globals.css";
// 引入之前在 vue 的共用樣式，之後有空改放到 global
import "@/styles/public/main.css"; // 樣式放在同一層
import "@/styles/public/formStyle.css"; // 引入 form 表單共用樣式
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </>
  );
}
