# 選擇 Node.js 作為基礎映像
FROM node:21.5.0
# 設定Docker時區為台灣，防止日期轉換出錯
# https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format:~:text=When%20the%20time%20zone%20offset%20is%20absent%2C%20date%2Donly%20forms%20are%20interpreted%20as%20a%20UTC%20time%20and%20date%2Dtime%20forms%20are%20interpreted%20as%20local%20time.
ENV TZ=Asia/Taipei
# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製剩餘的應用源代碼到工作目錄
COPY . .

# 構建應用 針對生產環境 通常會 Build 然後 start
RUN npm run build

# 指定容器啟動時要運行的命令
CMD ["npm", "start"]
