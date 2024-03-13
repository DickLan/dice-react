import Head from "next/head";
import Image from "next/image";
import styles from "@/pages/home.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isAbleToRollDice, setIsAbleToRollDice] = useState(true);
  const [timeDisplay, setTimeDisplay] = useState(60);
  const [queueStatusDisplay, setQueueStatusDisplay] = useState("等待中");

  const rollDice = (i: number) => {
    console.log(`骰子 ${i} 被骰出`);
    // 這裡實現你骰骰子的邏輯
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
              src="https://www.youtube.com/embed/ENrW13a7TEg?si=vKM3ScXyVhn3g04Y&autoplay=0&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* 排隊佇列顯示 */}
          {/* 先把畫面框架移植完 再來處理有動態變數的部分 */}
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
