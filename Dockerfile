# ベースとなるNode.jsのイメージ
FROM node:20-slim

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# 設定ファイルをコピーして中身をインストール
COPY package.json ./
RUN npm install

# 残りのソースコードをコピー
COPY . .

# ポート3000を開放
EXPOSE 3000

# アプリを起動
CMD ["npm", "start"]