import Head from "next/head";
import Image from "next/image";
import styles from "@/pages/home.module.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import { apiHelper } from "@/utils/helpers";
import { Toast } from "@/composables/toast";
import { useAuth } from "@/context/AuthContext";
// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { Socket } from "socket.io-client";
import Spinner from "@/components/spinner/index";

type User = {
  id: string;
  name: string;
};
export default function Home() {
  const [isAbleToRollDice, setIsAbleToRollDice] = useState(true);
  const [timeDisplay, setTimeDisplay] = useState(10);
  const [queueStatusDisplay, setQueueStatusDisplay] = useState("等待中");
  const [queueingUsers, setQueueingUsers] = useState<User[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);
  // 稍後從 context 獲取當前用戶的 ID
  // const currentUser = { id: "當前用戶 ID", name: "dummy" };
  // 從 useAuth 提取當前使用者，並命名成 authUser，避免衝突
  const { isAuthenticated, currentUser: authUser } = useAuth();
  let currentUser = { id: -1, name: "初始匿名用戶" };

  // 因為 youtube 直撥延遲有點久，新增個 spinner
  // 合理化等待時間，收到成功骰骰子的訊息後，才會顯示約兩秒
  const [isSpinning, setIsSpinning] = useState(false);

  if (isAuthenticated) {
    currentUser = authUser;
  }

  // 使用 useRef 來創建對象，並保持對 socket 的引用，這樣整個元件都可訪問相同狀態的 socket
  const socketRef = useRef<Socket | null>(null);
  const socketURL = process.env.NEXT_PUBLIC_URL || "http://localhost:3003";

  useEffect(() => {
    // 掛載時設定 socket 事件監聽器

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
        data.queueId &&
        data.queueId.includes(currentUser.id)
      ) {
        const displayStatus =
          data.queueIdAndName[0].id === currentUser.id ? "輪到你辣" : "等待中";
        setQueueStatusDisplay(displayStatus);
        setIsAbleToRollDice(data.queueIdAndName[0].id === currentUser.id);
      } else {
        setIsAbleToRollDice(false);
        // 後端 socket 倒數完後，也清除前端秒數
        setTimeDisplay(0);
        setQueueStatusDisplay("可加入");
      }
      setQueueingUsers(data.queueIdAndName);
    });

    // 初始掛載 timer,每秒向伺服器更新剩餘遊玩秒數
    const interval = setInterval(() => {
      if (socketRef.current) {
        console.log("requestCountdown emitted");
        socketRef.current.emit("requestCountdown");
      }
    }, 1000);

    socketRef.current.on("updateCountdown", (data) => {
      setTimeDisplay(data.countdown);
    });

    // 卸載時移除事件監聽器
    return () => {
      if (socketRef.current) {
        socketRef.current.off("queueStatusUpdateFromServer");
      }
    };
  }, []); // 在依賴陣列中新增 currentUser.id

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
    if (socketRef.current) {
      socketRef.current.emit("joinQueue", { id, name });
    }
  }

  // 骰骰子邏輯
  async function rollDice(i: number) {
    try {
      // 創建一個 promise 來等待伺服器的回應
      const waitForResponse = new Promise<any>((resolve, reject) => {
        if (socketRef.current) {
          socketRef.current.once("beforeUserRollDiceQueueCheck", (data) => {
            console.log("data", data);
            resolve(data); // 使用服務器的響應解決 Promise
          });

          // 發送檢查排隊序列的請求到服務器
          socketRef.current.emit("beforeUserRollDiceQueueCheck", {
            id: currentUser.id,
          });
        }
      });

      const checkResultResponse = await waitForResponse; // 等待服務器回應
      if (!checkResultResponse) {
        Toast.fire({
          icon: "error",
          title: "骰骰子失敗2",
        });
      }
      // if server return true msg
      // 伺服器比較正確 會得到 true ，才能骰骰子
      if (checkResultResponse.msg !== "True") {
        console.log("YY");

        console.log("順序比對錯誤");
        setIsAbleToRollDice(false);
        return;
      }

      // 取消 api 驅動骰子，改用 socket 驅動，因為之前後端已經寫好 socket 順序檢查
      if (socketRef.current) {
        socketRef.current.emit("userRollDice", {
          id: currentUser.id,
        });
      }

      // 拖延時間的 spinner 處理邏輯
      setIsSpinning(true);
      setTimeout(() => {
        setIsSpinning(false);
        Toast.fire({
          icon: "success",
          title: "驗證成功，啟動！",
        });
      }, 2000);
      setIsAbleToRollDice(false);
    } catch (error) {
      console.log("error", error);
      setIsAbleToRollDice(true);

      setIsSpinning(true);
      setTimeout(() => {
        setIsSpinning(false);
      }, 2000);
      setIsAbleToRollDice(false);
      Toast.fire({
        icon: "error",
        title: "驗證失敗！",
      });
    }
  }

  // computed => useMemo
  const queueStatusClass = useMemo(() => {
    if (queueStatusDisplay === "等待中") {
      return "queueStatusDisplay-waiting";
    } else if (queueStatusDisplay === "輪到你辣") {
      return "queueStatusDisplay-playing";
    } else if (queueStatusDisplay === "可加入") {
      return "queueStatusDisplay-ready";
    }
  }, [queueStatusDisplay]);

  return (
    <>
      <Head>
        {/* Head 是分頁標題 */}
        <title>Dice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container-outside">
        <div className="container home-page-container">
          {/* react 元件，若要接受 style屬性，必須先在 Spinner 定義 property type */}
          {/* <Spinner style={{display:true?1:2}}/> */}
          <Spinner style={{ display: isSpinning ? "flex" : "none" }} />

          <div className="intro">
            <h2>哈囉 {currentUser.name}</h2>
            <h3>歡迎來到十八仔</h3>

            {/* 因為是連到外部網站 所以這裡不用 Link, 直接用 <a> */}

            <span>骰一次 10 元，骰到 666 時，可以到 </span>
            <a
              className={styles["outside-link"]}
              href="https://www.littlesheng.com/accounts"
            >
              小盛 Pokemon Go
            </a>
            <span> 兌換任何一個八千元以下寶可夢帳號</span>
            <br />
            {/* <span> 其他三連號可兌換四千元以下寶可夢帳號</span> */}

            <h4>{"操作流程：登入 => 排隊 => 骰骰子 (十秒內必須骰出)"}</h4>
          </div>

          {/* youtube 轉播畫面 */}
          <div className={styles.content}>
            <div className={styles["video-wrapper"]}>
              {/* <!-- YouTube嵌入iframe --> */}
              {/* 在 React 和 TypeScript 中使用 <iframe> 時，你需要遵循 JSX 和 TypeScript 的規範來指定屬性名=> 小駝峰命名  */}
              <iframe
                width="500"
                height="315"
                src="https://www.youtube.com/embed/RBGhuKsqbxs?si=zfskt-vJi4OFDHHD&autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* 排隊佇列顯示 */}
            {/* 先把畫面框架移植完 再來處理有動態變數的部分 圖像辨識骰子紀錄，如果目前做不出來，可以先弄假資料在 db，重點是學習處理動態資料*/}
            <div className={styles["queue-wrapper"]}>
              <button onClick={joinQueue}>開始排隊</button>
              {/* // <!-- 排隊狀態顯示 --> */}
              <h3>可遊玩秒數</h3>
              <h4>{timeDisplay} s</h4>
              <p className="queueStatusClass">狀態: {queueStatusDisplay} </p>
              {/* <!-- 排隊佇列顯示 --> */}
              <ul>
                {queueingUsers.map((user, index) => (
                  <li key={user.id}>
                    順序 {index + 1} : {user.name}
                  </li>
                ))}
              </ul>
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
      </div>
    </>
  );
}
