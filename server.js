const express = require('express');
const app = express();
const PORT = 3000;

// アクセス解析のための設定（フォームからのデータを読み取る用）
app.use(express.urlencoded({ extended: true }));

// メモを保存する配列
let memoList = [
    "課題を今日中に終わらせる！",
    "Dockerの基本を復習する"
];

// ① メモ帳のメイン画面 (GET)
app.get('/', (req, res) => {
    // 各メモに「消去ボタン付きのフォーム」をセットしてHTMLにする
    // index（配列の番号）をサーバーに送ることで、どれを消すか判断します
    const memoItems = memoList.map((memo, index) => {
        return `
            <li>
                <span class="memo-text">${memo}</span>
                <form action="/delete-memo" method="POST" style="margin: 0;">
                    <input type="hidden" name="memoIndex" value="${index}">
                    <button type="submit" class="delete-btn">消去</button>
                </form>
            </li>
        `;
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
                .input-form { display: flex; gap: 10px; margin-bottom: 20px; }
                input[type="text"] { flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; }
                .add-btn { padding: 10px 20px; font-size: 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .add-btn:hover { background-color: #218838; }
                ul { list-style-type: none; padding: 0; }
                li { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-bottom: 1px solid #ddd; margin-bottom: 5px; border-radius: 4px; }
                .memo-text { word-break: break-all; flex: 1; padding-right: 10px; }
                .delete-btn { padding: 5px 10px; font-size: 14px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .delete-btn:hover { background-color: #c82333; }
            </style>
        </head>
        <body>
            <h1>📝 サーバーサイドメモ帳</h1>
            
            <form action="/add-memo" method="POST" class="input-form">
                <input type="text" name="memoContent" placeholder="新しいメモを入力..." required>
                <button type="submit" class="add-btn">追加</button>
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
    const newMemo = req.body.memoContent;
    if (newMemo) {
        memoList.unshift(newMemo); // 配列の先頭に追加
    }
    res.redirect('/');
});

// ③ メモを消去する処理 (POST) 【★新しく追加】
app.post('/delete-memo', (req, res) => {
    const targetIndex = req.body.memoIndex; // 消したいメモの配列番号を取得
    
    if (targetIndex !== undefined) {
        memoList.splice(targetIndex, 1); // 指定された番号のメモを1件削除
    }
    res.redirect('/'); // メイン画面に戻す
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});