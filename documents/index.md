# Express + TypeScript API サーバー開発 要件定義

## 目的

Express/TypeScript を用いて、フロントエンド分離前提の **API サーバー** を自作する。
実務で通用する構成・設計（責務分離、認証、バリデーション、エラー統一、基本セキュリティ）を取り入れる。

---

## 技術スタック

- Node.js / Express
- TypeScript
- DB: SQLite
- ORM: TypeORM（マイグレーション含む）
- 認証: JWT（Bearer + リフレッシュトークン）
- バリデーション: express-validator
- ログ: pino 等
- Lint/Format: ESLint + Prettier

---

## アプリの性質

- API サーバーとしてのみ動作（View は持たない）
- REST API を提供
- DB CRUD を含む
- 実務を意識したディレクトリ分割（1 ファイルに集約しない）

---

## ドメイン（例：Task 管理）

### エンティティ

#### User

- id: UUID
- email: string（unique）
- passwordHash: string
- createdAt / updatedAt

#### Task

- id: UUID
- ownerUserId: User.id（所有者）
- title: string
- description?: string
- status: "TODO" | "DOING" | "DONE"（任意フィールド）
- createdAt / updatedAt
- deletedAt（ソフトデリート、任意）

---

## API 要件

### 認証（JWT）

- `POST /auth/register`
  - email, password を受け取る
  - password はハッシュ化して保存（bcrypt 推奨）
  - パスワード強度: 最小 8 文字以上
  - email 重複は 409 など適切なエラーにする
- `POST /auth/login`
  - email, password を検証
  - 成功時 JWT（アクセストークン）を返す
  - リフレッシュトークンも返す
- `POST /auth/refresh`
  - リフレッシュトークンで新しいアクセストークンを発行
- `POST /auth/logout`
  - トークンの無効化（ブラックリスト管理など）
- `GET /me`
  - Bearer トークン必須
  - 自分のユーザー情報を返す

### Task CRUD（認証必要）

- `POST /tasks` 作成
  - body: { title: string, description?: string, status?: "TODO" | "DOING" | "DONE" }
- `GET /tasks` 一覧
  - ページネーション: `?page=1&limit=20`（デフォルト: page=1, limit=20）
  - ソート: `?sortBy=createdAt&order=DESC`（デフォルト: createdAt DESC）
  - フィルタ: `?status=TODO`（status でフィルタリング）
  - レスポンス: { data: Task[], meta: { page, limit, total, totalPages } }
- `GET /tasks/:id` 取得
  - 所有者のみアクセス可能
- `PATCH /tasks/:id` 更新（部分更新）
  - body: { title?: string, description?: string, status?: "TODO" | "DOING" | "DONE" }
  - 所有者のみ更新可能
- `DELETE /tasks/:id` 削除（論理/物理どちらでも可）
  - 所有者のみ削除可能

### 認可（Authorization）

- Task は **所有者のみ** 操作可能
- 他人の Task へのアクセスは 404（存在しないものとして扱う）で統一

### その他のエンドポイント

- `GET /health` または `GET /healthz`
  - ヘルスチェック用（DB 接続確認など）

---

## バリデーション要件

- body / params / query を検証する
- 不正入力は 400 で返す
- バリデーションエラーは **統一エラー形式** に変換する
- 採用案
  - express-validator（ルートに validation chain + validate middleware）
- バリデーションルール例
  - email: 有効なメール形式、必須
  - password: 最小 8 文字、必須
  - title: 最大 200 文字、必須
  - description: 最大 1000 文字、任意
  - status: "TODO" | "DOING" | "DONE" のいずれか、任意

---

## セキュリティ

- Helmet（セキュリティヘッダ）
- CORS（許可 Origin を環境変数で管理）
- Rate Limit
  - `/auth/*`: 5 回/15 分
  - その他: 100 回/15 分
- x-powered-by 無効化
- JWT secret 等は env 管理
- パスワードハッシュ化: bcrypt（salt rounds 10 以上）
- SQL インジェクション対策: ORM 使用で自動対応
- XSS 対策: 入力値のサニタイズ（express-validator で対応）

## アーキテクチャ

### 各レイヤーの役割

- **Routes**: URL と HTTP メソッドの対応を定義し、Controller に処理を振り分ける
- **Controllers**: HTTP リクエスト/レスポンスを処理し、Service にビジネスロジックを委譲
- **Services**: ビジネスロジックを実装（認証、権限チェック、データ処理など）
- **Repositories**: データベース操作のみを担当（DB 変更時の影響範囲を限定）
- **Entities**: データベーステーブル構造を定義（TypeORM）
- **Middlewares**: リクエスト処理の前後で実行（認証、バリデーション、エラーハンドリング、セキュリティ）
- **Utils**: 共通関数を集約（JWT 生成、パスワードハッシュ化、エラー生成など）
- **DTO/Types**: リクエスト/レスポンスの型定義（TypeScript の型安全性を活用）

## ディレクトリ構成

**注意**: 以下のディレクトリ構成は**あくまで例**であり、実装の段階では必ずベストプラクティスを遵守すること。プロジェクトの規模や要件に応じて、より適切な構成を採用すること。特に、関連する機能をまとめる（例: DB 関連を`db/`ディレクトリに統合するなど）、保守性と可読性を重視した構成を心がけること。

```
src/
  app.ts                    # アプリケーション初期化
  server.ts                 # サーバー起動
  db/                       # データベース関連を統合
    entities/              # エンティティ定義（TypeORM）
    repositories/          # リポジトリ（Service内で直接TypeORMを使う方法も可）
    migrations/            # TypeORM マイグレーション（自動生成）
  routes/                  # ルーティング定義
  controllers/             # コントローラー（HTTP リクエスト/レスポンス処理）
  services/                # サービス（ビジネスロジック）
  middlewares/             # ミドルウェア（認証、バリデーション、エラーハンドリング、セキュリティ）
  utils/                   # ユーティリティ関数（JWT、パスワードハッシュ化、エラー生成など）
  dto/                     # データ転送オブジェクト（リクエスト/レスポンスの型定義）
```

## エラーハンドリング

- error middleware を用意し、例外を統一エラー形式で返す
- 想定エラー（AppError 等）と想定外（500）を区別
- HTTP ステータスコード統一ルール
  - 200: 成功
  - 201: 作成成功
  - 400: バリデーションエラー、不正なリクエスト
  - 401: 認証エラー（トークンなし/無効）
  - 403: 認可エラー（権限なし）
  - 404: リソース不存在
  - 409: リソース競合（email 重複など）
  - 500: サーバーエラー（想定外エラー）

## レスポンス形式

### 成功レスポンス

```json
{
  "success": true,
  "data": { ... }
}
```

### エラーレスポンス

```json
{
	"success": false,
	"error": {
		"code": "ERROR_CODE",
		"message": "エラーメッセージ",
		"details": {}
	}
}
```

### ページネーション付きレスポンス

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## データベース管理

### マイグレーション

- TypeORM のマイグレーション機能を使用
- 初期マイグレーション: User, Task テーブル作成
- インデックス設定
  - User.email: UNIQUE インデックス
  - Task.ownerUserId: インデックス（検索性能向上）

### 初期データ（Seed）

- 開発環境用のテストユーザー作成（任意）

---

## 型定義

- リクエスト/レスポンスの型を定義（`dto/` または `types/` に配置）
- Express Request に user プロパティを追加（`types/express.d.ts`）:

```typescript
declare global {
	namespace Express {
		interface Request {
			user?: { id: string; email: string };
		}
	}
}
```

---

## ログ管理

- 構造化ログ（pino 使用時）
- ログレベル: error, warn, info, debug
- 出力内容: リクエスト ID、メソッド、パス、ステータスコード、エラー詳細、実行時間

---

## 環境変数管理

### 必須環境変数

- `PORT`: サーバーポート（デフォルト: 3000）
- `NODE_ENV`: development | production | test
- `JWT_SECRET`: JWT 署名用シークレット
- `JWT_EXPIRES_IN`: トークン有効期限（例: "1h"）
- `REFRESH_TOKEN_SECRET`: リフレッシュトークン用
- `REFRESH_TOKEN_EXPIRES_IN`: リフレッシュトークン有効期限（例: "7d"）
- `CORS_ORIGIN`: 許可する Origin（カンマ区切り）

### 環境変数管理

- `.env.example` ファイルを作成し、必須項目を明記
- `.env` ファイルで環境変数を直接管理（`dotenv`パッケージを使用）
- `process.env` で環境変数にアクセス
