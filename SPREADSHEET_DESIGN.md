# THAI NAVI スプレッドシート設計

## 店舗データの列一覧
`id, status, is_pr, name_ja, name_en, area, genre, price_range, hours, access, address, google_map_url, official_url, instagram_url, tiktok_url, facebook_url, x_url, tags, beginner_friendly, japanese_support, late_night, sns_checked, sns_memo, caution, editor_memo, description, image_url, updated_at`

## 各列の説明
- `id`: 一意ID
- `status`: 公開状態（`active` / `draft`）
- `is_pr`: PR掲載フラグ（`true` / `false`）
- `name_ja` / `name_en`: 店舗名
- `area`: エリア名（Nana/Asok等）
- `genre`: ジャンル（ラウンジ、バー等）
- `price_range`: 料金目安
- `hours`: 営業時間
- `access`: 最寄り駅・移動導線
- `address`: 住所
- `google_map_url`: Google Maps URL
- `official_url`: 公式サイトURL
- `instagram_url` / `tiktok_url` / `facebook_url` / `x_url`: SNS URL
- `tags`: 絞り込みタグ
- `beginner_friendly` / `japanese_support` / `late_night` / `sns_checked`: 真偽値フラグ
- `sns_memo`: SNS観測内容
- `caution`: 注意点
- `editor_memo`: 管理人短文メモ
- `description`: 紹介文
- `image_url`: 画像URL
- `updated_at`: 更新日

## 入力例
- `status`: `active`
- `is_pr`: `true`
- `tags`: `初心者向け,日本語対応,深夜営業`
- `sns_checked`: `true`

## statusの使い方
- `active`: サイトに表示
- `draft`: 非表示（下書き）

## is_prの使い方
- `true`: PR掲載として上位表示、PRラベル表示
- `false`: 通常掲載

## tagsの書き方
- 半角カンマ区切り（例: `初心者向け,日本語対応`）
- 先頭/末尾スペースは入れない

## SNS URLの書き方
- `https://` から始まる完全URL
- 未設定は空欄で可

## image_urlの扱い
- HTTPS画像URLを推奨
- 画像未設定でも表示が崩れない設計
- 権利確認済み素材のみ使用

## 更新運用ルール
1. 変更時は `updated_at` を更新
2. 営業時間・料金の変更は `caution` へ補足
3. SNS観測更新時は `sns_memo` を短文で追記
4. 公開前に `status` の最終確認
