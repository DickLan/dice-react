import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";

// font 字型，暫時先不用
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        {/* Head 是分頁標題 */}
        <title>Dice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


  <div class="container">
    <div class="intro">
      <h3>歡迎來到十八仔</h3>
      <span>骰一次 10 元，骰到 666 時，可以到 </span>
      <a href="https://www.littlesheng.com/accounts">小盛 Pokemon Go</a>
      <span> 兌換任何一個八千元以下寶可夢帳號</span>
      <br>
      <span> 其他三連號可兌換四千元以下寶可夢帳號</span>

      <h4>登入=>排隊=>骰骰子</h4>
    </div>
    <div class="content">
      <div class="video-wrapper">
        <!-- YouTube嵌入iframe -->
        <iframe width="560" height="315"
          src="https://www.youtube.com/embed/ENrW13a7TEg?si=vKM3ScXyVhn3g04Y&autoplay=0&mute=1"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>

      <div class="queue-wrapper">
        <button @click="joinQueue">開始排隊</button>
        <!-- 排隊狀態顯示 -->
        <h3>可遊玩秒數</h3>
        <!-- <h4>{{ timeDisplay }}60 s</h4> -->
        <h4>60 s</h4>
        <p :class="queueStatusClass">狀態: {{ queueStatusDisplay }} </p>
        <!-- 排隊佇列顯示 -->
        <ul>
        </ul>
        <li v-for="(user, index) in queueingUsers" :key="user.id">順序 {{ index + 1 }} : {{ user.name }}</li>
      </div>
    </div>
    <div class="action-buttons">
      <!-- 操作按鈕 -->

      <template v-for="i in 1" v-bind:key="{i}">
        <button class="roll" @click="rollDice(i)" :disabled="!isAbleToRollDice">骰骰子</button>
      </template>

      <!-- <button @click="endGame">結束遊玩</button> -->
      <button v-if="false" class="roll" @click="endPlay(110)" :disabled="!canRoll">復歸{{ m110 }}</button>
    </div>

  </div>
      {/* 預設專案建好就有了 先留著做參考 後面熟了較可以刪掉 */}
      {/* <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}></div>

        <div className={styles.center}></div>
      </main> */}
    </>
  );
}
