# MRD - Photo Log

## 使い方（最短）
1) `images/` に画像を入れる（例: `images/20260204_1230.jpg`）  
2) `posts/posts.json` の `posts` 配列に1件追加  
3) commit / push（GitHub Pagesで表示）

## posts.json の1件フォーマット
- `date` : `YYYY-MM-DD` 推奨（ソートに使う）
- `image`: `images/...`（相対パス） or `https://...`
- `comment`: ひとこと
- `tags`: 任意

## GitHub Pages
`Settings → Pages → (Deploy from a branch) → main / (root or /mrd)`  
リポジトリ構成に合わせて選ぶ。
