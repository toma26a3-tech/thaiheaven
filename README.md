# THAI NAVI

## サイト概要
THAI NAVIは、日本人旅行者・タイ在住日本人向けの「タイ夜遊び・ナイトライフ情報メディア」です。予約サイトではなく、店舗・エリア・ジャンル・現地SNS観測ログ・初心者向け注意点を整理する情報紹介メディアとして運用します。

## ファイル構成
- `index.html` : 1ページ構成の静的UI
- `style.css` : スマホファーストのスタイル定義
- `config.js` : CSV URLやフォールバックデータなどの設定
- `renderer.js` : CSV取得/パース/描画/フィルター処理
- `SPREADSHEET_DESIGN.md` : スプレッドシート設計仕様

## ローカル確認方法
1. このディレクトリを開く
2. `index.html` をブラウザで開く（または簡易サーバー利用）
3. `config.js` の `CSV_URL` を有効な公開CSVに変更して確認

## Googleスプレッドシート連携方法
1. Googleスプレッドシートを作成
2. `SPREADSHEET_DESIGN.md` の列順でヘッダーを作成
3. 店舗データを入力
4. 「ファイル > 共有 > ウェブに公開」でCSV公開
5. 公開URLを `config.js` の `CSV_URL` に設定

## CSV公開方法
- 公開形式: `CSV`
- 対象: 該当シート
- URL例: `https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv`

## config.jsの編集方法
- `CSV_URL`: 公開CSV URL
- `FALLBACK_STORES`: CSV取得失敗時に表示する最低限データ
- `SITE_NAME`, `MANAGER_NAME`: ブランド設定

## Vercel / Netlify / Cloudflare Pagesへの公開方法
### Vercel
- GitHub連携でリポジトリをインポート
- Framework Presetは `Other`
- Build Command不要、Output Directoryはルート

### Netlify
- New site from Git
- Build command空欄
- Publish directory: `/`

### Cloudflare Pages
- Connect to Git
- Framework preset: `None`
- Build commandなし
- Build output directory: `/`

## 店舗追加方法
1. スプレッドシートに1行追加
2. `status=active` に設定
3. `tags` をカンマ区切りで入力
4. `updated_at` 更新

## 掲載プラン編集方法
- `index.html` の「掲載申込」セクション内 `plan-grid` を編集
- 料金改定時は同時に運用メモを更新

## 注意事項
- 本サイトは情報メディアであり予約導線は実装しない
- 「予約する」「LINE予約」等のCTAは禁止
- 成人向け要素を含む可能性があるため18歳以上の注意書きを維持
- 営業時間/料金は変動するため、訪問前の再確認を推奨
