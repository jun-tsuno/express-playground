# 詳細設計

## エラーハンドリングミドルウェア

アプリケーション全体で発生するエラーを一元的に処理し、統一されたレスポンス形式で返却する。

```
リクエスト
    │
    ▼
┌─────────────────────────────────┐
│  ミドルウェア（JSON parser等）   │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  ルート → コントローラー         │
│         → サービス              │
└─────────────────────────────────┘
    │
    │ エラー発生時
    ▼
┌─────────────────────────────────┐
│  asyncHandler                   │
│  Promise.reject を next() へ    │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  errorHandler（エラーミドルウェア）│
│                                 │
│  ┌───────────────────────────┐  │
│  │ AppError か判定            │  │
│  │ (instanceof でチェック)    │  │
│  └───────────────────────────┘  │
│        │              │         │
│       YES            NO         │
│        │              │         │
│        ▼              ▼         │
│   想定内エラー    想定外エラー    │
│   (404,400等)      (500)        │
└─────────────────────────────────┘
    │
    ▼
統一レスポンス形式で返却
```

### エラーの分類

| 分類         | 説明                             | 例                             | 処理                                  |
| ------------ | -------------------------------- | ------------------------------ | ------------------------------------- |
| 想定内エラー | 開発者が意図的にスローするエラー | NotFoundError, ValidationError | AppError から statusCode, code を取得 |
| 想定外エラー | 予期せず発生するエラー           | DB 接続エラー, TypeError       | 500 で固定レスポンス                  |

## asyncHandler

非同期ルートハンドラーをラップし、エラーを自動的に `next()` に渡すユーティリティ関数。
これによりコントローラーで try-catch が不要になる。

**背景：Express は非同期エラーを自動でキャッチしない**

```typescript
// asyncHandler なし → エラーが握りつぶされる
router.get("/:id", async (req, res) => {
	const task = await getTaskByIdService(req.params.id); // ← エラー発生
	res.json(task);
});
// → レスポンスが返らず、リクエストがタイムアウトする
```

**解決策：asyncHandler でラップ**

```typescript
// asyncHandler あり → エラーが errorHandler へ渡る
router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const task = await getTaskByIdService(req.params.id); // ← エラー発生
		res.json(task);
	})
);
// → errorHandler で統一レスポンスが返る
```

```
asyncHandler(コントローラー関数)
      │
      ▼
┌─────────────────────────────────────┐
│  新しい関数を返す                     │
│  (req, res, next) => {              │
│    Promise.resolve(fn(...))         │
│      .catch(next);                  │
│  }                                  │
└─────────────────────────────────────┘
      │
      │ リクエスト時に実行
      ▼
┌─────────────────────────────────────┐
│  コントローラー関数を実行             │
└─────────────────────────────────────┘
      │                    │
    成功                  失敗
      │                    │
      ▼                    ▼
  正常レスポンス      .catch(next)
                          │
                          ▼
                   next(error) が呼ばれる
                          │
                          ▼
                   errorHandler へ
```

コントローラーごとに異なる Request 型を使えるようにするため、ジェネリクス型を使用。

```typescript
getTask   → GetTaskRequest    (params: { id: string })
postTask  → CreateTaskRequest (body: { title: string, ... })
patchTask → UpdateTaskRequest (params: { id }, body: { ... })
```

```typescript
export const asyncHandler = <T = Request>(fn: AsyncHandler<T>) => { ... };
//                          ↑ 任意の Request 型を受け取れる

// 使用時に自動で型推論される
router.get("/:id", asyncHandler(getTask));
//                              ↑ T = GetTaskRequest と推論
```
