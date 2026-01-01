# 実装計画

## ステップ 1: プロジェクトセットアップ

- [x] プロジェクト初期化（package.json, tsconfig.json, ESLint, Prettier）
- [x] 依存パッケージインストール
- [x] ディレクトリ構造作成

---

## ステップ 2: 基本設定とユーティリティ

- [x] 環境変数管理
- [x] 型定義（Express Request 拡張、DTO）
- [ ] ユーティリティ関数（errors, response, password, jwt, logger）
  - [x] errors
  - [x] response
  - [x] password
  - [x] jwt
  - [ ] logger

---

## ステップ 3: データベース設定

- [x] TypeORM 設定
- [x] エンティティ作成（User, Task）
- [x] マイグレーション作成・実行

---

## ステップ 4: ミドルウェア実装

- [ ] セキュリティミドルウェア（Helmet, CORS, Rate Limit）
  - [ ] Helmet
  - [x] CORS
  - [ ] Rate Limit
- [ ] リクエスト ID ミドルウェア
- [x] バリデーションミドルウェア
- [x] エラーハンドリングミドルウェア

---

## ステップ 5: 認証機能実装

- [ ] 認証サービス（register, login, refresh, logout）
  - [x] register
  - [x] login
  - [ ] refresh
  - [ ] logout
- [ ] 認証リポジトリ（任意）
- [x] 認証コントローラー
- [x] 認証ルート
- [x] 認証ミドルウェア（JWT 検証）

---

## ステップ 6: Task CRUD 機能実装

- [x] Task サービス（create, findAll, findOne, update, delete）
- [ ] Task リポジトリ（任意）
- [x] Task コントローラー
- [x] Task ルート

---

## ステップ 7: アプリケーション統合

- [x] メインアプリケーション（app.ts）
- [x] ルーティング統合（routes/index.ts）
- [x] サーバー起動（server.ts）
- [ ] ヘルスチェックエンドポイント（任意）

---

## ステップ 8: 最終調整とテスト

- [x] バリデーション実装
- [ ] エラーハンドリング確認
- [ ] セキュリティ確認
- [ ] 動作確認

---

## 実装の優先順位

### 必須（最低限の動作）

1. ステップ 1: プロジェクトセットアップ
2. ステップ 2: 基本設定とユーティリティ（errors, response, password, jwt）
3. ステップ 3: データベース設定
4. ステップ 4: ミドルウェア（security, validate, error）
5. ステップ 5: 認証機能（register, login, getMe）
6. ステップ 6: Task CRUD 機能（基本的な CRUD）
7. ステップ 7: アプリケーション統合

### 推奨（機能強化）

- リフレッシュトークン機能
- ページネーション、ソート、フィルタ
- ソフトデリート
- ログ管理（pino）
- リポジトリパターン

---

## 実装時の注意点

1. **依存関係**: 下位レイヤー（utils, entities）から実装する
2. **段階的実装**: 各ステップで動作確認を行う
3. **エラーハンドリング**: 早期に統一エラー形式を実装する
4. **型安全性**: TypeScript の型を活用する
5. **セキュリティ**: パスワードハッシュ化、JWT 設定を正しく実装する
