# THAI NAVI

## サイト概要
THAI NAVIは、日本人旅行者・タイ在住日本人向けの「タイ夜遊び・ナイトライフ情報メディア」です。予約サイトではなく、店舗・エリア・ジャンル・現地SNS観測ログ・初心者向け注意点を整理する情報紹介メディアとして運用します。

## ファイル構成（すべてルート直下）
- `index.html` : 1ページ構成の静的UI
- `style.css` : スマホファーストのスタイル定義
- `config.js` : CSV URLやフォールバックデータなどの設定
- `renderer.js` : CSV取得/パース/描画/フィルター処理
- `README.md` : 運用手順・公開手順
- `SPREADSHEET_DESIGN.md` : スプレッドシート設計仕様
- `.gitignore` : Git管理除外設定

## ローカル確認方法（ビルド不要）
1. このディレクトリを開く
2. `index.html` をブラウザで開く
3. `config.js` の `CSV_URL` を有効な公開CSVに変更して確認

> このサイトはビルド不要の静的サイトです。`npm install` は不要です。

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

## config.jsの編集方法（CSV URL差し替え）
- `config.js` を開く
- `CSV_URL` を新しい公開CSV URLへ変更
- 変更をGitHubへpushすると、各ホスティングで自動反映しやすい構成です

## GitHubリポジトリ作成手順
1. GitHubで新規リポジトリを作成（例: `thai-navi`）
2. 公開/非公開を選択して作成
3. ローカルのこのプロジェクトをリポジトリへ接続

## 初回push手順
以下のコマンドを順番に実行します。

```bash
git init
git add .
git commit -m "Initial release of THAI NAVI"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## 公開手順

### GitHub Pages
1. GitHubリポジトリの `Settings > Pages` を開く
2. `Build and deployment` の `Source` で `Deploy from a branch` を選択
3. Branchを `main` / `/ (root)` に設定
4. 保存後、発行されたURLで公開を確認

### Vercel
1. Vercelで `Add New Project`
2. GitHubリポジトリを選択
3. Framework Presetは `Other`
4. Build Commandは空欄、Output Directoryはルート
5. Deploy

### Netlify
1. Netlifyで `Add new site` > `Import an existing project`
2. GitHubリポジトリを接続
3. Build command空欄
4. Publish directory: `/`
5. Deploy

### Cloudflare Pages
1. Cloudflare Pagesで `Create a project`
2. GitHubリポジトリを接続
3. Framework preset: `None`
4. Build commandなし
5. Build output directory: `/`
6. Deploy

## 更新運用ルール（GitHub前提）
- 店舗情報更新は**Googleスプレッドシートで実施**し、サイトはCSVを再読込して反映
- デザイン変更や機能変更は**GitHub上の差分（commit / PR）で管理**
- 更新履歴はGitログで追跡し、ロールバック可能な運用を維持

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
