# Workflow Map

家庭、学校、総務部、施設、イベント運営など、用途ごとに「ワーク」を作り、**ワーク → 案件 → 工程 → タスク → 担当者 → 状態**で整理するモバイルファーストWebアプリです。

## 現在の公開版
- 複数ワークを作成し、ワークごとに自由な名前を設定
- ワークごとにメンバー・案件を分離
- 案件 → 工程 → タスクの階層管理
- 担当者、期限、状態、メモ
- 自分の担当、担当未定、相手待ち、履歴
- JSONバックアップ / 復元
- PWA / manual.html
- 初期データは空。個人の実データや氏名を含まない

現在はブラウザの localStorage に端末保存します。Supabase共有版は、Supabase側の権限確認後に接続します。

## 公開URL
https://branzfamily01.github.io/workflow-map/

## マニュアル
https://branzfamily01.github.io/workflow-map/manual.html
