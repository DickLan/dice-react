// 設定外層 layout
// 預計要有 上排 Navbar, 下排 Footer
// 先做上排 Navbar
import Navbar from "@/components/navbar"

// { children }是js的解構賦值語法，從函數參數對象提取children屬性
//  { children: React.ReactNode }是 TS的類型註釋，用於定義 children屬性的類型
// 在這裡類型被指定為 React.ReactNode，表示可以被渲染的任何 react 元素, 包含字串數字或數組...等
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container-outside">
        <div className="container">{children}</div>
      </div>
    </>
  )
}
