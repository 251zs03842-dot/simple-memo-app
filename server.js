const express = require('express');
const app = express();
const PORT = 3000;

// アクセス解析のための設定（フォームから送信された文字を読み取る用）
app.use(express.urlencoded({ extended: true }));

// メモを保存する配列（サーバーが起動している間、ここにデータが溜まります）
let memoList = [
    "課題を今日中に終わらせる！",
    "Dockerの基本を復習する"
];

// ① メモ帳のメイン画面 (GET)
app.get('/', (req, res) => {
    // 保存されているメモを箇条書きのHTMLにする
    const memoItems = memoList.map((memo, index) => {
        return `<li>${memo}</li>`;
    }).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <title>簡易メモ帳アプリ</title>
            <style>
                body { font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 0 20px; }
                h1 { text-align: center; color: #333; }
                form { display: flex; gap: 10px; margin-bottom: 20px; }
                input[type="text"] { flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
                button { padding: 10px 20px; font-size: 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background-color: #218838; }
                ul { list-style-type: none; padding: 0; }
                li { padding: 12px; background: #f8f9fa; border-bottom: 1px solid #ddd; margin-bottom: 5px; border-radius: 4px; word-break: break-all; }
            </style>
        </head>
        <body>
            <h1>📝 サーバーサイドメモ帳</h1>
            
            <form action="/add-memo" method="POST">
                <input type="text" name="memoContent" placeholder="新しいメモを入力..." required>
                <button type="submit">追加</button>
            </form>

            <h3>メモ一覧</h3>
            <ul>
                ${memoItems.length > 0 ? memoItems : '<li>メモはまだありません。</li>'}
            </ul>
        </body>
        </html>
    `);
});

// ② 新しいメモを追加する処理 (POST)
app.post('/add-memo', (req, res) => {
    const newMemo = req.body.memoContent; // フォームから送られてきた文字を取得
    
    if (newMemo) {
        memoList.unshift(newMemo); // 配列の先頭に新しいメモを追加
    }
    
    // メモを追加したら、メイン画面（トップページ）に自動で戻す（リダイレクト）
    res.redirect('/');
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});