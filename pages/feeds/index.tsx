// 先用假資料 設計版面
// 後續能夠圖像辨識骰子點數時，再來建 db 相關流程
import styles from "@/pages/feeds/feeds.module.css";

type Feed = {
  userId: number;
  userName: string;
  point1: number;
  point2: number;
  point3: number;
  isWin: boolean;
  reward: string;
  date: string;
};

const feeds: Feed[] = [
  {
    userId: 1,
    userName: "apple",
    point1: 3,
    point2: 5,
    point3: 6,
    isWin: false,
    date: "2022-10-01 12:30:00",
    reward: "None",
  },
  {
    userId: 2,
    userName: "banana",
    point1: 1,
    point2: 2,
    point3: 3,
    isWin: false,
    date: "2022-10-02 13:45:00",
    reward: "None",
  },
  {
    userId: 3,
    userName: "cherry",
    point1: 6,
    point2: 6,
    point3: 6,
    isWin: true,
    date: "2022-10-03 14:15:00",
    reward: "頭獎",
  },
  {
    userId: 4,
    userName: "date",
    point1: 4,
    point2: 4,
    point3: 4,
    isWin: true,
    date: "2022-10-04 15:30:00",
    reward: "二獎",
  },
  {
    userId: 5,
    userName: "elderberry",
    point1: 2,
    point2: 2,
    point3: 5,
    isWin: false,
    date: "2022-10-05 16:00:00",
    reward: "None",
  },
];

export default function Feeds() {
  return (
    <>
      <div>Feeds</div>
      <span>目前是假資料，後續圖形辨識加上後，再繼續更新</span>
      <table className={styles["feeds-table"]}>
        <tr>
          <th className={styles["feeds-th"]}>User ID</th>
          <th className={styles["feeds-th"]}>User Name</th>
          <th className={styles["feeds-th"]}>Point 1</th>
          <th className={styles["feeds-th"]}>Point 2</th>
          <th className={styles["feeds-th"]}>Point 3</th>
          <th className={styles["feeds-th"]}>Win/Lose</th>
          <th className={styles["feeds-th"]}>Reward</th>
          <th className={styles["feeds-th"]}>Date</th>
        </tr>
        {feeds.map((feed) => {
          return (
            <>
              <tr>
                <td className={styles["feeds-td"]}>{feed.userId}</td>
                <td className={styles["feeds-td"]}>{feed.userName}</td>
                <td className={styles["feeds-td"]}>{feed.point1}</td>
                <td className={styles["feeds-td"]}>{feed.point2}</td>
                <td className={styles["feeds-td"]}>{feed.point3}</td>
                <td
                  className={`${styles["feeds-td"]} ${feed.isWin ? styles["win"] : styles["lose"]}`}
                >
                  {feed.isWin ? "Win" : "Lose"}
                </td>
                <td className={styles["feeds-td"]}>{feed.reward}</td>
                <td className={styles["feeds-td"]}>{feed.date}</td>
              </tr>
            </>
          );
        })}
      </table>
    </>
  );
}
