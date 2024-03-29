import Head from "next/head"
import Image from "next/image"
import styles from "@/pages/home.module.css"
import React, { useState, useEffect, useRef, useMemo } from "react"
import io from "socket.io-client"
import { apiHelper } from "@/utils/helpers"
import { Toast } from "@/composables/toast"
import { useAuth } from "@/components/auth/useAuth"
// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { Socket } from "socket.io-client"
import Spinner from "@/components/spinner/index"
// 之後有空要將 socket 移動到自訂 hook
import useSocket from "@/hooks/useSocket"

export default function Home() {
  // 稍後從 context 獲取當前用戶的 ID
  // const currentUser = { id: "當前用戶 ID", name: "dummy" };
  // 從 useAuth 提取當前使用者，並命名成 authUser，避免衝突
  const { isAuthenticated, currentUser: authUser } = useAuth()
  let currentUser = { id: -1, name: "亞洲賭聖" }

  // 定義狀態來儲存是否為移動裝置
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    checkIsMobile() // 初始檢查
    window.addEventListener("resize", checkIsMobile) // 視窗大小改變時，也做檢查
    return () => window.removeEventListener("resize", checkIsMobile) // 元件解除安裝時，移除監聽避免佔用資源
  }, [])

  if (isAuthenticated) {
    currentUser = authUser
  }
  const {
    isAbleToRollDice,
    timeDisplay,
    queueStatusDisplay,
    queueStatusClass,
    queueingUsers,
    isSpinning,
    joinQueue,
    rollDice,
    isPageLoading,
  } = useSocket(currentUser, isAuthenticated)

  // 根據 timeDisplay 的值顯示不同的顏色
  const timeClass = useMemo(() => {
    return timeDisplay <= 5 ? styles["time-critical"] : ""
  }, [timeDisplay])

  return (
    <>
      <Head>
        {/* Head 是分頁標題 */}
        <title>Dice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 加入 正在載入時的 spinner */}
      {isPageLoading ? (
        <Spinner />
      ) : (
        <>
          {/* react 元件，若要接受 style屬性，必須先在 Spinner 定義 property type */}
          {/* <Spinner style={{display:true?1:2}}/> */}
          <Spinner style={{ display: isSpinning ? "flex" : "none" }} />

          <div className={styles.intro}>
            <h2 className={styles.greet}>哈囉 {currentUser.name}</h2>
            <h3 className={styles.welcome}>歡迎來到十八仔</h3>
            <h4 className={styles.steps}>
              {"操作流程：登入 => 排隊 => 骰骰子 (十秒內必須骰出)"}
            </h4>
            {/* 因為是連到外部網站 所以這裡不用 Link, 直接用 <a> */}
            <div className={styles["award-info"]}>
              <h5>骰一次 10 元</h5>
              <>
                <span>骰出 666 ，可至</span>
                <a
                  className={styles["outside-link"]}
                  href="https://www.littlesheng.com/accounts"
                >
                  小盛 Pokemon Go
                </a>
                <span> 兌換任何一個八千元以下寶可夢帳號</span>
              </>

              <br />
              <>
                <span>骰出 444 ，可至</span>
                <a
                  className={styles["outside-link"]}
                  href="https://tomb.littlesheng.com"
                >
                  雲端祖墳
                </a>
                <span>私訊小編為您客制專屬的線上靈骨塔</span>
              </>

              <br />
              <>
                <span>骰出 222 ，可至</span>
                <a
                  className={styles["outside-link"]}
                  href="https://tomb.littlesheng.com"
                >
                  模型展示網
                </a>
                <span>兌換任一鋼彈模型(尚未實作)</span>
              </>
            </div>
          </div>

          {/* video + queue status */}
          <div className={styles.content}>
            {/* youtube 轉播畫面 */}
            <div className={styles["video-wrapper"]}>
              {/* <!-- YouTube嵌入iframe --> */}
              {/* 在 React 和 TypeScript 中使用 <iframe> 時，你需要遵循 JSX 和 TypeScript 的規範來指定屬性名=> 小駝峰命名  */}
              <iframe
                // width=100%
                // height="315"
                style={
                  isMobile
                    ? { width: "100%", height: "100%", minWidth: "100%rem" }
                    : { width: 500, height: 300 }
                }
                src="https://www.youtube-nocookie.com/embed/isb2ifnhzSo?si=zfskt-vJi4OFDHHD&autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share "
                allowFullScreen
              ></iframe>
            </div>

            {/* 排隊佇列顯示 */}
            {/* 先把畫面框架移植完 再來處理有動態變數的部分 圖像辨識骰子紀錄，如果目前做不出來，可以先弄假資料在 db，重點是學習處理動態資料*/}
            <div className={styles["queue-wrapper"]}>
              <div className={styles["mobile-queue-1"]}>
                <button className={styles["queue-button"]} onClick={joinQueue}>
                  開始排隊
                </button>
              </div>
              {/* // <!-- 排隊狀態顯示 --> */}
              <div className={styles["mobile-queue-2"]}>
                <h3 className={styles["play-time-label"]}>可遊玩秒數</h3>
                <h4 className={`${styles["time-display"]} ${timeClass}`}>
                  {timeDisplay} s
                </h4>
              </div>

              <br />
              {/* <!-- 排隊佇列顯示 --> */}
              <div className={styles["mobile-queue-3"]}>
                <p className={styles.queueStatusClass}> 排隊狀態</p>
                <p> {queueStatusDisplay} </p>
                <ul className="queue-user-names">
                  {queueingUsers.map((user, index) => (
                    <li key={user.id}>
                      {index + 1} - {user.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* <!-- 操作按鈕 --> */}
          {/* <span>{isAbleToRollDice.toString()}</span> */}
          <div className={styles["action-buttons-area"]}>
            {Array.from({ length: 1 }, (_, i) => (
              <button
                onClick={() => rollDice(i)}
                className={
                  isAbleToRollDice
                    ? styles["action-buttons-button-available"]
                    : styles["action-buttons-button-disabled"]
                }
                key={i}
                disabled={!isAbleToRollDice}
              >
                骰骰子
              </button>
            ))}

            {/* 結束遊玩預計改成 時間到都自動結束 不用手動按 */}
            {/* <!-- <button @click="endGame">結束遊玩</button> -->
      <button v-if="false" className="roll" @click="endPlay(110)" :disabled="!canRoll">復歸{{ m110 }}</button> */}
          </div>
        </>
      )}
    </>
  )
}
