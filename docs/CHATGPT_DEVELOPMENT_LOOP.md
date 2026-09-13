# ChatGPT開発ループ

このリポジトリでは、ChatGPTからGitHubを操作するときも、`main` を直接変更せず、安全な開発ループを使います。

## 基本フロー

1. `main` の現在状態を確認する
2. 作業内容に合った作業ブランチを作る
3. 必要なファイルだけ読んで変更する
4. 小さな単位で commit する
5. Pull Request を作る
6. GitHub Actions のテスト結果を確認する
7. 失敗したら原因を確認して修正する
8. テスト成功後にレビューして Merge する
9. Merge 後の `main` の Actions も確認する

## 役割のイメージ

- GitHub = コードを保存するノート
- branch = 安全に作業するためのノートのコピー
- commit = ゲームのセーブポイント
- Pull Request = 「この変更を本番側に入れていい？」という申請
- GitHub Actions = GitHub上で自動的にテストする作業PC
- VPS = インターネット上でアプリを動かすサーバー

## 安全ルール

- `main` に直接作業コミットを入れない
- パスワード、APIキー、SSH秘密鍵、`.env` の秘密値をGitに保存しない
- 投薬量をアプリ側で自動決定・処方しない
- データベース変更は migration として管理する
- 重要な変更はテストを追加してから Merge する

## VPSデプロイの位置づけ

VPSへの自動デプロイは、GitHubでの「branch → commit → PR → Actions → 修正 → Merge」のループが安定してから追加します。

その際も秘密情報はGitHub Secrets等の安全な仕組みに置き、リポジトリには保存しません。
