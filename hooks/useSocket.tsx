import Head from "next/head";
import Image from "next/image";
import styles from "@/pages/home.module.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { apiHelper } from "@/utils/helpers";
import { Toast } from "@/composables/toast";
import { useAuth } from "@/context/AuthContext";
// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

type User = {
  id: number;
  name: string;
};
import Spinner from "@/components/spinner/index";

const useSocket = (currentUser: User, isAuthenticated: boolean) => {
  const [isAbleToRollDice, setIsAbleToRollDice] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState(0);
  const [queueStatusDisplay, setQueueStatusDisplay] = useState("等待中");
  const [queueingUsers, setQueueingUsers] = useState<User[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);

  // 使用 useRef 來創建對象，並保持對 socket 的引用，這樣整個元件都可訪問相同狀態的 socket
  const socketRef = useRef<Socket | null>(null);
  const socketURL = process.env.NEXT_PUBLIC_URL || "http://localhost:3003";

  // 因為 youtube 直撥延遲有點久，新增個 spinner
  // 合理化等待時間，收到成功骰骰子的訊息後，才會顯示約兩秒
  const [isSpinning, setIsSpinning] = useState(false);
  // 設定個 isLoading spinner
  const [isPageLoading,setIsPageLoading]=useState(true)

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
        if (displayStatus==="輪到你辣"){
        setIsAbleToRollDice(true)
      }
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
        // console.log("requestCountdown emitted");
        socketRef.current.emit("requestCountdown");
      }
    }, 1000);

    socketRef.current.on("updateCountdown", (data) => {
      setTimeDisplay(data.countdown);
    });

          // 第一次載入 將 loading 設為 false，表示已經成功載入
      if (isPageLoading){
        setIsPageLoading(false)
      }
    // 卸載時移除事件監聽器
    return () => {
      if (socketRef.current) {
        socketRef.current.off("queueStatusUpdateFromServer");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return {
    isAbleToRollDice,
    timeDisplay,
    queueStatusDisplay,
    queueStatusClass,
    queueingUsers,
    isSpinning,
    joinQueue,
    rollDice,
    isPageLoading
  };
};

export default useSocket;
