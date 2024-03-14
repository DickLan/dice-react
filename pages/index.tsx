import Head from "next/head";
import Image from "next/image";
import styles from "@/pages/home.module.css";
import React, { useState, useEffect,useRef } from "react";
import Link from "next/link";
import io from "socket.io-client";
import { apiHelper } from "@/utils/helpers";
import { Toast } from "@/composables/toast";
import { useAuth } from "@/context/AuthContext";
// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isAbleToRollDice, setIsAbleToRollDice] = useState(true);
  const [timeDisplay, setTimeDisplay] = useState(60);
  const [queueStatusDisplay, setQueueStatusDisplay] = useState("等待中");
  const [queueingUsers, setQueueingUsers] = useState([]);
  const [isQueueing, setIsQueueing] = useState(false);
  // 從 context 獲取當前用戶的 ID
  const currentUser = { id: "當前用戶 ID", name: "dummy" };
  const { isAuthenticated } = useAuth();
  
  // 使用 useRef 來創建對象，並保持對 socket 的飲用，這樣整個元件都可訪問相同狀態的　socket
  const socketRef = useRef(null)

  useEffect(() => {
    // 掛載時設定 socket 事件監聽器
      const socketURL = process.env.NEXT_PUBLIC_URL || "http://localhost:3003";

    const token = localStorage.getItem("token");
    console.log("socketURL", socketURL);
    socketRef.current = io(`${socketURL}`, {
      path: "/api/socket.io",
      auth: {
        token: token,
      },
    });
    socketRef.current.on("queueStatusUpdateFromServer", (data) => {
      if (
        data.queueIdAndName.length > 0 &&
        data.queueId.includes(currentUser.id)
      ) {
        const displayStatus =
          data.queueIdAndName[0].id === currentUser.id ? "輪到你辣" : "等待中";
        setQueueStatusDisplay(displayStatus);
        setIsAbleToRollDice(data.queueIdAndName[0].id === currentUser.id);
      } else {
        setIsAbleToRollDice(false);
        setQueueStatusDisplay("可加入");
      }
      setQueueingUsers(data.queueIdAndName);
    });
    // 卸載時移除事件監聽器
    return () => {
      socketRef.current.off("queueStatusUpdateFromServer");
    };
  }, []);

  // 排隊方法
  function joinQueue() {
    console.log("socketURL=", socketURL);
    // 啟動排隊邏輯
    // 登入後才能排隊
    if (!isAuthenticated) {
      Toast.fire({
        icon: "error",
        title: "請先登入才能開始排隊",
      });
      return;
    }
    // 確認登入 開啟排隊邏輯
    setIsQueueing(true); // 排隊中 ＝ｔｒｕｅ
    const { id, name } = currentUser;
    console.log("id=", id);
    socket.emit("joinQueue", { id, name });
  }

  const rollDice = (i: number) => {
    console.log(`骰子 ${i} 被骰出`);
    // 下面是骰骰子的邏輯
  };

  return (
    <>
      <Head>
        {/* Head 是分頁標題 */}
        <title>Dice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="intro">
          <h3>歡迎來到十八仔</h3>
          <span>骰一次 10 元，骰到 666 時，可以到 </span>
          {/* 因為是連到外部網站 所以這裡不用 Link, 直接用 <a> */}
          <a
            className={styles["outside-link"]}
            href="https://www.littlesheng.com/accounts"
          >
            小盛 Pokemon Go
          </a>
          <span> 兌換任何一個八千元以下寶可夢帳號</span>
          <br />
          <span> 其他三連號可兌換四千元以下寶可夢帳號</span>
          <h4>{"登入=>排隊=>骰骰子(十秒內必須骰出)"}</h4>
        </div>

        {/* youtube 轉播畫面 */}
        <div className={styles.content}>
          <div className={styles["video-wrapper"]}>
            {/* <!-- YouTube嵌入iframe --> */}
            {/* 在 React 和 TypeScript 中使用 <iframe> 時，你需要遵循 JSX 和 TypeScript 的規範來指定屬性名=> 小駝峰命名  */}
            <iframe
              width="500"
              height="315"
              src="https://www.youtube.com/embed/CSl5Cbkego8?si=Mv_w-sgXV-0_l-0h&autoplay=1&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* 排隊佇列顯示 */}
          {/* 先把畫面框架移植完 再來處理有動態變數的部分 圖像辨識骰子紀錄，如果目前做不出來，可以先弄假資料在 db，重點是學習處理動態資料*/}
          <div className={styles["queue-wrapper"]}>
            {/* <button @click="joinQueue">開始排隊</button> */}
            {/* // <!-- 排隊狀態顯示 --> */}
            <h3>可遊玩秒數</h3>
            <h4>{timeDisplay} s</h4>
            <p className="queueStatusClass">狀態: {queueStatusDisplay} </p>
            {/* // <!-- 排隊佇列顯示 -->
        // <ul>
        // </ul>
        // <li v-for="(user, index) in queueingUsers" :key="user.id">順序 {{ index + 1 }} : {{ user.name }}</li> */}
          </div>
        </div>

        {/* <!-- 操作按鈕 --> */}
        <div className={styles["action-buttons-area"]}>
          {Array.from({ length: 1 }, (_, i) => (
            <button
              onClick={() => rollDice(i)}
              className={styles["action-buttons-button"]}
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
      </div>
    </>
  );
}
