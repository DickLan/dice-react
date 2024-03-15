import style from "@/components/spinner/spinner.module.css"
// 新增 style 屬性的類型定義，以便後續使用 style 來控制顯示與否
// Spinner 元件現在接受一個名為 style 的屬性（類型為 React.CSSProperties），並將其用於設定 spinner 元素的樣式。
type SpinnerProps={
  style?: React.CSSProperties; 
}

export default function Spinner({style:customStyle}:SpinnerProps){
// 只要 bouncing-loader 類名在父元素上正確應用，它的直接子元素（這裡三個 div）就會接收到定義在 .bouncing-loader>div 選擇器中的樣式。
  return(<>
    <div className={style.spinner} style={customStyle}>
    <div className={style["bouncing-loader"]}>
      <div />
      <div />
      <div />
    </div>
  </div>
  </>)
}