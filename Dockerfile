# 選擇 Node.js 作為基礎映像
FROM node:21.5.0

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
